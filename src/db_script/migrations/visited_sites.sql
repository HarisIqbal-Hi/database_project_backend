CREATE TABLE visited_sites (
                               id SERIAL PRIMARY KEY,
                               user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                               place_id INTEGER REFERENCES places(id) ON DELETE CASCADE,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               UNIQUE (user_id, place_id)  -- Prevent duplicate visits for the same user/place
);