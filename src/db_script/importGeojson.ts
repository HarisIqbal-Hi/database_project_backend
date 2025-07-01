import dotenv from "dotenv";
import path from "path";
import fs from "fs";
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
    const prop = feature.properties;
    return prop.amenity || prop.tourism || prop.museum || prop.leisure || prop.category || "unknown";
}

async function createTables() {
    // Enable PostGIS
    await client.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);

    // Categories
    await client.query(`
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name TEXT UNIQUE NOT NULL
        );
    `);

    // Places
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

    // Users
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            password_hash TEXT NOT NULL,
            interests TEXT[],
            location TEXT
        );
    `);

    // Favorites
    await client.query(`
        CREATE TABLE IF NOT EXISTS favorites (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            place_id INTEGER REFERENCES places(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, place_id)
        );
    `);

    // Visited Sites
    await client.query(`
        CREATE TABLE IF NOT EXISTS visited_sites (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            place_id INTEGER REFERENCES places(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, place_id)
        );
    `);

    // Achievements
    await client.query(`
        CREATE TABLE achievements
        (
            id          SERIAL PRIMARY KEY,
            user_id     INTEGER NOT NULL,
            type        TEXT    NOT NULL,
            description TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (user_id, type)
        );
    `);
}

(async () => {
    // 1. Read and parse GeoJSON
    const geojson = JSON.parse(fs.readFileSync(GEOJSON_FILE, "utf8"));
    if (!geojson.features || !Array.isArray(geojson.features)) throw new Error("GeoJSON 'features' missing");

    // 2. Create all tables
    await createTables();

    // 3. Collect unique categories
    const categoriesSet = new Set<string>();
    geojson.features.forEach((feature: any) => {
        categoriesSet.add(getCategory(feature));
    });
    const categories = Array.from(categoriesSet);

    // 4. Insert categories and get IDs
    const categoryNameToId: Record<string, number> = {};
    for (const cat of categories) {
        const res = await client.query(
            `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id;`,
            [cat]
        );
        categoryNameToId[cat] = res.rows[0].id;
    }

    // 5. Insert places
    for (const feature of geojson.features) {
        const mappedProps = mapProps(feature.properties);
        const category = getCategory({ properties: mappedProps });
        const category_id = categoryNameToId[category];
        const name = mappedProps.name || null;
        const website = mappedProps.website || null;

        delete mappedProps.name;
        delete mappedProps.website;

        await client.query(
            `INSERT INTO places (name, category_id, website, geometry, properties)
             VALUES ($1, $2, $3, ST_SetSRID(ST_GeomFromGeoJSON($4), 4326), $5)`,
            [name, category_id, website, JSON.stringify(feature.geometry), mappedProps]
        );
    }

    console.log(`✅ Imported ${geojson.features.length} places into normalized tables!`);
    await client.end();
})();