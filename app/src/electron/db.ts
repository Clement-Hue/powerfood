import sqlite from "sqlite3"
import createTables from "./create-tables.sql"

let db!: sqlite.Database

export function createDatabase() {
    db = new sqlite.Database("app.db")
    db.exec(createTables, (err) => {
        if (err) {
            console.error("Error initialising tables", err.message)
        } else {
            console.info("Tables initialised")
        }
    })
}
export default db