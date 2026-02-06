-- Fujifilm Recipe Database Schema

-- Cameras table
CREATE TABLE IF NOT EXISTS cameras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model TEXT NOT NULL UNIQUE,
    generation TEXT,
    has_grain_effect INTEGER DEFAULT 1,
    has_color_chrome_effect INTEGER DEFAULT 0,
    has_color_chrome_fx_blue INTEGER DEFAULT 0,
    has_clarity INTEGER DEFAULT 0
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    film_simulation TEXT NOT NULL,
    white_balance TEXT DEFAULT 'Auto',
    white_balance_shift_red INTEGER DEFAULT 0,
    white_balance_shift_blue INTEGER DEFAULT 0,
    dynamic_range TEXT DEFAULT 'DR100',
    highlight INTEGER DEFAULT 0,
    shadow INTEGER DEFAULT 0,
    color INTEGER DEFAULT 0,
    sharpness INTEGER DEFAULT 0,
    noise_reduction INTEGER DEFAULT 0,
    grain_effect TEXT DEFAULT 'Off',
    grain_size TEXT DEFAULT 'Small',
    color_chrome_effect TEXT DEFAULT 'Off',
    color_chrome_fx_blue TEXT DEFAULT 'Off',
    clarity INTEGER DEFAULT 0,
    iso_range_min INTEGER DEFAULT 160,
    iso_range_max INTEGER DEFAULT 12800,
    exposure_compensation TEXT DEFAULT '0',
    sample_images TEXT DEFAULT '[]',
    source TEXT DEFAULT 'manual',
    source_url TEXT,
    author TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tags table for recipe categorization
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL
);

-- Recipe-Tags junction table
CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_id INTEGER,
    tag_id INTEGER,
    weight REAL DEFAULT 1.0,
    PRIMARY KEY (recipe_id, tag_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Recipe-Cameras compatibility table
CREATE TABLE IF NOT EXISTS recipe_cameras (
    recipe_id INTEGER,
    camera_id INTEGER,
    PRIMARY KEY (recipe_id, camera_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipe_tags_recipe ON recipe_tags(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_tag ON recipe_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);
CREATE INDEX IF NOT EXISTS idx_recipes_film_simulation ON recipes(film_simulation);
