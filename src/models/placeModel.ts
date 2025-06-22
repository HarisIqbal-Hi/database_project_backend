import client from "../db/connection";

export async function getPlaces({ categoryId, search }: { categoryId?: number, search?: string }) {
    let query = `
        SELECT
            places.id,
            places.name,
            places.category_id,
            categories.name AS category,         -- Get category name!
            places.website,
            places.properties,
            ST_X(places.geometry) AS longitude,
            ST_Y(places.geometry) AS latitude
        FROM places
                 LEFT JOIN categories ON places.category_id = categories.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];
    if (categoryId) {
        conditions.push("places.category_id = $" + (params.length + 1));
        params.push(categoryId);
    }
    if (search) {
        conditions.push("LOWER(places.name) LIKE $" + (params.length + 1));
        params.push(`%${search.toLowerCase()}%`);
    }
    if (conditions.length) {
        query += " WHERE " + conditions.join(" AND ");
    }
    const result = await client.query(query, params);
    return result.rows;
}


export async function getPlaceById(id: number) {
    const result = await client.query("SELECT * FROM places WHERE id = $1", [id]);
    return result.rows[0];
}

export async function getPlacesGeoJSON() {
    const result = await client.query(`
        SELECT jsonb_build_object(
            'type', 'FeatureCollection',
            'features', jsonb_agg(
                jsonb_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(geometry)::jsonb,
                    'properties', properties || jsonb_build_object('id', id, 'name', name, 'category_id', category_id)
                )
            )
        ) AS geojson FROM places
    `);
    return result.rows[0]?.geojson;
}