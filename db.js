// Database: SQLite via better-sqlite3
import Database from 'better-sqlite3';

// Open (or create) the database file in the project root
const db = new Database('recipes.db');

// Create the recipes table if it does not exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    description  TEXT,
    category     TEXT NOT NULL,
    time_minutes INTEGER NOT NULL,
    servings     INTEGER NOT NULL,
    difficulty   TEXT NOT NULL DEFAULT 'easy',
    photo_url    TEXT,
    ingredients  TEXT NOT NULL,
    steps        TEXT NOT NULL,
    created_at   TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Categories: breakfast, soups, mains, salads, baking, desserts

export default db;
