import client from "../db_script/connection";

export async function addVisited(userId: number, placeId: number) {
    // Insert if not already exists
    await client.query(
        `INSERT INTO visited_sites (user_id, place_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, place_id) DO NOTHING`,
        [userId, placeId]
    );
}

export async function removeVisited(userId: number, placeId: number) {
    await client.query(
        `DELETE FROM visited_sites WHERE user_id = $1 AND place_id = $2`,
        [userId, placeId]
    );
}

export async function getVisited(userId: number) {
    const res = await client.query(
        `SELECT p.* FROM places p
         INNER JOIN visited_sites v ON v.place_id = p.id
         WHERE v.user_id = $1`, [userId]
    );
    return res.rows;
}

export async function isVisited(userId: number, placeId: number) {
    const res = await client.query(
        `SELECT 1 FROM visited_sites WHERE user_id = $1 AND place_id = $2`,
        [userId, placeId]
    );
    return (res.rowCount as number) > 0;
}
