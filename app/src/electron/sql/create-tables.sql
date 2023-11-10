CREATE TABLE IF NOT EXISTS day (
    name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS nutrient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    dri_amount REAL,
    dri_unit TEXT
);

CREATE TABLE IF NOT EXISTS food (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT
    proteins REAL,
    lipids REAL,
    carbs REAL,
    calories INTEGER
);

CREATE TABLE IF NOT EXISTS food_nutrient (
    food_id INTEGER,
    nutrient_id INTEGER,
    unit TEXT,
    amount REAL,
    FOREIGN KEY (food_id) REFERENCES food(id),
    FOREIGN KEY (nutrient_id) REFERENCES nutrient(id),
    PRIMARY KEY (food_id, nutrient_id)
);

CREATE TABLE IF NOT EXISTS meal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    day_name TEXT,
    FOREIGN KEY (day_name) REFERENCES day(name)
);

CREATE TABLE IF NOT EXISTS meal_food (
    meal_id INTEGER,
    food_id INTEGER,
    unit TEXT,
    amount REAL,
    FOREIGN KEY (meal_id) REFERENCES meal(id),
    FOREIGN KEY (food_id) REFERENCES food(id),
    PRIMARY KEY (meal_id, food_id)
);
