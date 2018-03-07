create table if not exists "user_info" (
    id SERIAL PRIMARY KEY NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);

create table if not exists "device_token" (
    id INTEGER PRIMARY KEY NOT NULL,
    device_token TEXT NOT NULL,
    FOREIGN KEY(id) REFERENCES user_info(id) ON DELETE CASCADE
);

create table if not exists "container" (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    pill_type TEXT,
    reminder_time TIME NOT NULL,
    frequency INTEGER NOT NULL,
    last_opened TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES user_info(id) ON DELETE CASCADE
);

create table if not exists "user_push_token" (
    user_id INTEGER NOT NULL,
    push_token TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user_info(id) ON DELETE CASCADE
);

create table if not exists "drug_info" (
    brand_name TEXT NOT NULL,
    description TEXT,
    manufacturer_name TEXT,
    substance_name TEXT,
    warnings TEXT,
    storage_and_handling TEXT,
    purpose TEXT,
    indications_and_usage TEXT,
    brand_primary_color TEXT,
    brand_secondary_color TEXT
);

create table if not exists "reminder" (
    container_id INTEGER NOT NULL,
    reminder_time TIME NOT NULL,
    FOREIGN KEY(container_id) REFERENCES container(id) ON DELETE CASCADE
);
-- create table "reminders" (
--     id SERIAL PRIMARY KEY NOT NULL,
--     container_id INTEGER NOT NULL,
--     remind_at TIMESTAMP NOT NULL,
--     FOREIGN KEY(container_id) REFERENCES container(id) ON DELETE CASCADE
-- );
