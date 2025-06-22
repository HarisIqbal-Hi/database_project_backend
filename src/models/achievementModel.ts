import client from "../db/connection";

export async function addAchievement(userId: number, type: string, description: string) {
    const result = await client.query(
        `INSERT INTO achievements (user_id, type, description)
         VALUES ($1, $2, $3) RETURNING *`,
        [userId, type, description]
    );
    return result.rows[0];
}

export async function getAchievements(userId: number) {
    const result = await client.query(
        `SELECT * FROM achievements WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
    );
    return result.rows;
}
