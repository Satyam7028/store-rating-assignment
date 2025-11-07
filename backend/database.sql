CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'OWNER');

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    address VARCHAR(400),
    role user_role NOT NULL DEFAULT 'USER', 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    rating_value INTEGER NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),

    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_user_store_rating UNIQUE (user_id, store_id)
);