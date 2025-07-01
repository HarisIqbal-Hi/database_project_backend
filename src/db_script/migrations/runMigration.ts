import fs from "fs";
import path from "path";
import client from "../connection"; // Adjust the import if your connection file is elsewhere

const sqlFile = path.join(__dirname, "achivements.sql");
const sql = fs.readFileSync(sqlFile, "utf8");

async function runMigration() {
    try {
        await client.query(sql);
        console.log("✅ Users table created (if not exists)");
    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        await client.end();
    }
}

runMigration();
