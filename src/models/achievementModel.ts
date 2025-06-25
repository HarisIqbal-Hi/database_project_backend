import client from "../db/connection";

export async function addAchievement(userId: number, type: string, description: string) {
    const result = await client.query(
        `INSERT INTO achievements (user_id, type, description)
         VALUES ($1, $2, $3) RETURNING *`,
        [userId, type, description]
    );
    return result.rows[0];
}
export async function upsertAchievement(userId: number, type: string, desc: string) {
    await client.query(
        `INSERT INTO achievements (user_id, type, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, type) DO UPDATE
             SET description = EXCLUDED.description`,
        [userId, type, desc]
    );
}

export async function getAchievements(userId: number) {
    const result = await client.query(
        `SELECT * FROM achievements WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
}

// Count visited and favorite places
export async function getUserStats(userId: number) {
    // Get all visited place IDs
    const visitedRows = await client.query(
        "SELECT place_id FROM visited_sites WHERE user_id = $1",
        [userId]
    );
    const favoriteRows = await client.query(
        "SELECT place_id FROM favorites WHERE user_id = $1",
        [userId]
    );

    const visitedPlaceIds = visitedRows.rows.map(r => r.place_id);
    const favoritePlaceIds = favoriteRows.rows.map(r => r.place_id);

    return {
        visited: visitedPlaceIds.length,
        favorites: favoritePlaceIds.length,
        visitedPlaceIds,
        favoritePlaceIds
    };
}