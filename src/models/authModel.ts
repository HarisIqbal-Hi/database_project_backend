import client from "../db/connection";

export async function createUser(username: string, email: string, hash: string) {
    const result = await client.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
        [username, email, hash]
    );
    return result.rows[0];
}

export async function findUserByUsername(username: string) {
    const result = await client.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    return result.rows[0];
}
