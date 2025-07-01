import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

async function testConnection() {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL successfully!");

        // Optionally run a test query
        const res = await client.query("SELECT NOW()");
        console.log("Current time:", res.rows[0]);

    } catch (err) {
        console.error("Error connecting to PostgreSQL:", err);
    } finally {
        await client.end();
    }
}

testConnection();