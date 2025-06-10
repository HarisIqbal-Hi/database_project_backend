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
client.connect()
    .then(() => console.log("✅ Connected to Postgres!"))
    .catch((err) => {
        console.error("❌ Failed to connect to Postgres:", err);
        process.exit(1); // Optional: Stop the server if DB fails
    });

export default client;
