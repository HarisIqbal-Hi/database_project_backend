import client from "../db/connection";


// Add at the top
export async function setInterests(userId: number, interests: string[]) {
    const result = await client.query(
        "UPDATE users SET interests = $2 WHERE id = $1 RETURNING id, username, interests",
        [userId, interests]
    );
    return result.rows[0];
}

export async function checkinPlace(userId: number, placeId: number) {
    const result = await client.query(
        "UPDATE users SET current_checkin = $2 WHERE id = $1 RETURNING id, username, current_checkin",
        [userId, placeId]
    );
    return result.rows[0];
}

export async function getUsersCheckedIn(placeId: number) {
    const result = await client.query(
        "SELECT id, username, interests FROM users WHERE current_checkin = $1",
        [placeId]
    );
    return result.rows;
}

export async function updateUser(id: number, name?: string, location?: string,interests?:string[], email?: string) {
    const result = await client.query(
        `UPDATE users SET
                          full_name = COALESCE($2, full_name),
                          location = COALESCE($3, location),
                          interests = COALESCE($4, interests),
                          email = COALESCE($5, email)
         WHERE id = $1
             RETURNING id, username, full_name, email, location, interests`,
        [id, name, location, interests, email]
    );
    return result.rows[0];
}

export async function findUserById(id: number) {
    const result = await client.query(
        `SELECT id, username, interests, email, full_name,
            ST_X(location) AS lng,
            ST_Y(location) AS lat
     FROM users WHERE id = $1`,
        [id]
    );
    const row = result.rows[0];
    if (row && row.lat != null && row.lng != null) {
        row.location = { lat: row.lat, lng: row.lng };
    } else {
        row.location = null;
    }
    delete row.lat;
    delete row.lng;
    return row;
}