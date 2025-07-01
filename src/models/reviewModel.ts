import client from "../db_script/connection";

export async function addReview(userId: number, placeId: number, rating: number, vibe_rating: number, comment: string) {
    const result = await client.query(
        `INSERT INTO reviews (user_id, place_id, rating, vibe_rating, comment)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, placeId, rating, vibe_rating, comment]
    );
    return result.rows[0];
}

export async function getReviewsForPlace(placeId: number) {
    const result = await client.query(
        `SELECT r.*, u.username
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.place_id = $1
         ORDER BY r.created_at DESC`,
        [placeId]
    );
    return result.rows;
}