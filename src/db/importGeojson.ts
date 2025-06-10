import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
import client from "./connection";

dotenv.config();

const GEOJSON_FILE = path.join(__dirname, "../Chemnitz.geojson");

function mapProps(props: Record<string, any>) {
    return Object.entries(props).reduce((acc, [key, value]) => {
        acc[key.replace(/:/g, "_")] = value;
        return acc;
    }, {} as Record<string, any>);
}

function getCategory(feature: any): string {
    // Prioritize these keys, add others if needed
    const prop = feature.properties;
    return prop.tourism || prop.museum || prop.amenity || prop.leisure || prop.category || "unknown";
}

(async () => {
    // 1. Read and parse GeoJSON
    const geojson = JSON.parse(fs.readFileSync(GEOJSON_FILE, "utf8"));
    if (!geojson.features || !Array.isArray(geojson.features)) throw new Error("GeoJSON 'features' missing");

    // 2. Collect unique categories
    const categoriesSet = new Set<string>();
    geojson.features.forEach((feature: any) => {
        categoriesSet.add(getCategory(feature));
    });
    const categories = Array.from(categoriesSet);

    await client.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);

    // 4. Create tables (if not exist)
    await client.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );
  `);
    await client.query(`
    CREATE TABLE IF NOT EXISTS places (
      id SERIAL PRIMARY KEY,
      name TEXT,
      category_id INTEGER REFERENCES categories(id),
      website TEXT,
      geometry geometry,
      properties JSONB
    );
  `);

    // 5. Insert categories, get their ids
    const categoryNameToId: Record<string, number> = {};
    for (const cat of categories) {
        const res = await client.query(
            `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id;`,
            [cat]
        );
        categoryNameToId[cat] = res.rows[0].id;
    }

    // 6. Insert places
    for (const feature of geojson.features) {
        const mappedProps = mapProps(feature.properties);
        const category = getCategory({ properties: mappedProps });
        const category_id = categoryNameToId[category];
        const name = mappedProps.name || null;
        const website = mappedProps.website || null;

        // Remove fields you have as top-level columns
        delete mappedProps.name;
        delete mappedProps.website;

        // Insert
        await client.query(
            `INSERT INTO places (name, category_id, website, geometry, properties)
             VALUES ($1, $2, $3, ST_SetSRID(ST_GeomFromGeoJSON($4), 4326), $5)`,
            [name, category_id, website, JSON.stringify(feature.geometry), mappedProps]
        );
    }

    console.log(`✅ Imported ${geojson.features.length} places into normalized tables!`);
    await client.end();
})();
