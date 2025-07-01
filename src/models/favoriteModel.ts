import client from "../db_script/connection";

export async function addFavorite(userId: number, placeId: number) {
    const result = await client.query(
        "INSERT INTO favorites (user_id, place_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *",
        [userId, placeId]
    );
    return result.rows[0];
}

export async function removeFavorite(userId: number, placeId: number) {
    await client.query(
        "DELETE FROM favorites WHERE user_id = $1 AND place_id = $2",
        [userId, placeId]
    );
}

export async function getFavorites(userId: number) {
    const result = await client.query(
        `SELECT p.* FROM places p
        INNER JOIN favorites f ON f.place_id = p.id
        WHERE f.user_id = $1`, [userId]
    );
    return result.rows;
}

export async function getTotalFavoritesCount() {
    const res = await client.query("SELECT COUNT(*) FROM favorites");
    return Number(res.rows[0].count);
}
