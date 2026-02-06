import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'recipes.db');

let SQL = null;
let db = null;

export async function getDb() {
  if (db) return db;

  if (!SQL) {
    SQL = await initSqlJs();
  }

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    throw new Error('Database not initialized. Run: npm run init-db');
  }

  return db;
}

// Helper to convert sql.js results to array of objects
export function queryAll(db, sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params);
  }

  const results = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push(row);
  }
  stmt.free();
  return results;
}

export function queryOne(db, sql, params = []) {
  const results = queryAll(db, sql, params);
  return results.length > 0 ? results[0] : null;
}

// Run an INSERT/UPDATE/DELETE statement
export function run(db, sql, params = []) {
  db.run(sql, params);

  // Get last insert rowid before saving
  const lastIdResult = db.exec("SELECT last_insert_rowid() as id");
  const lastInsertRowid = lastIdResult.length > 0 && lastIdResult[0].values.length > 0
    ? lastIdResult[0].values[0][0]
    : 0;

  const changes = db.getRowsModified();

  // Save changes to disk
  saveDb();

  return { lastInsertRowid, changes };
}

// Save database to disk
export function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Initialize database (for use by import scripts)
export async function initializeDatabase() {
  return await getDb();
}
