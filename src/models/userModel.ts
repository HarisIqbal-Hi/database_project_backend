import client from "../db/connection";

export async function updateUser(id: number, name?: string, location?: string) {
    const result = await client.query(
        `UPDATE users SET
            username = COALESCE($2, username),
            location = COALESCE($3, location)
        WHERE id = $1 RETURNING id, username, email, location`,
        [id, name, location]
    );
    return result.rows[0];
}

export async function findUserById(id: number) {
    const result = await client.query(
        "SELECT id, username, email, location FROM users WHERE id = $1",
        [id]
    );
    return result.rows[0];
}