import client from "../db_script/connection";

export async function createUser(username: string, email: string, hash: string, fullName: string) {
    const result = await client.query(
        "INSERT INTO users (username, email, password_hash,full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email",
        [username, email, hash, fullName]
    );

    return result.rows[0];
}

export async function findUserByUsername(username: string) {
    const result = await client.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    console.log(result.rows[0]);
    return result.rows[0];
}
