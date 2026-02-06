import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = path.join(__dirname, 'db', 'recipes.db');
const schemaPath = path.join(__dirname, 'db', 'schema.sql');

// Use minimal seed if --minimal flag is passed
const useMinimal = process.argv.includes('--minimal');
const seedPath = path.join(__dirname, 'db', useMinimal ? 'seed-minimal.sql' : 'seed.sql');

async function initDatabase() {
  // Initialize SQL.js
  const SQL = await initSqlJs();

  // Create new database
  const db = new SQL.Database();

  // Read and execute schema
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.run(schema);
  console.log('Schema created successfully');

  // Read and execute seed data
  const seed = fs.readFileSync(seedPath, 'utf-8');
  db.run(seed);
  console.log('Seed data inserted successfully');

  // Verify data
  const recipeCount = db.exec('SELECT COUNT(*) as count FROM recipes')[0].values[0][0];
  const tagCount = db.exec('SELECT COUNT(*) as count FROM tags')[0].values[0][0];
  const cameraCount = db.exec('SELECT COUNT(*) as count FROM cameras')[0].values[0][0];

  console.log(`Database initialized with:`);
  console.log(`  - ${recipeCount} recipes`);
  console.log(`  - ${tagCount} tags`);
  console.log(`  - ${cameraCount} cameras`);

  // Save database to file
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
  console.log(`Database saved to ${dbPath}`);

  db.close();
}

initDatabase().catch(console.error);
