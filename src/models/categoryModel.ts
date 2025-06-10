import client from "../db/connection";
export async function getCategories() {
    const result = await client.query("SELECT * FROM categories");
    return result.rows;
}
