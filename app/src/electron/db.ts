import sqlite from "sqlite3"
import fs from "fs"
import createTables from "./sql/create-tables.sql"
import defaultValues from "./sql/defaut-values.sql"

let db!: sqlite.Database

export function createDatabase() {
    const dbPath = "./app.db"
    const isDatabaseExist = fs.existsSync(dbPath)
    db = new sqlite.Database(dbPath)
    db.exec(createTables, (err) => {
        if (err) {
            console.error("Error initialising tables", err.message)
        } else {
            console.info("Tables initialised")
        }
    })
    if (!isDatabaseExist) {
        db.exec(defaultValues, (err) => {
            if (err) {
                console.error("Error loading default values", err.message)
            } else {
                console.info("Default values loaded")
            }
        })
    }
}

export async function getAll<T, P = unknown>(sql: string, params: P[] = []) {
    return new Promise<T[]>((resolve, reject) => {
        db.all(sql, params, function (err, rows: T[] )  {
            if (err) {
                return reject(err)
            }
            return resolve(rows)
        })
    })
}

export async function run<P>(sql: string, params: P[] = []) {
    return new Promise<number>((resolve, reject) => {
        db.run(sql,params, function (err)  {
            if (err) {
                return reject(err)
            }
            return resolve(this.lastID)
        });
    })
}

export async function transaction<T>(fn: () => Promise<T>) {
    try {
       await run("BEGIN TRANSACTION")
       const res = await fn();
       await run("COMMIT");
       return res;
    } catch(err) {
      console.error("Error during transaction", err)
      await run("ROLLBACK");
      throw err;
    }
}
export default () => db;