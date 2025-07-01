CREATE TABLE IF NOT EXISTS favorites
(
    id
    SERIAL
    PRIMARY
    KEY,
    user_id
    INTEGER
    REFERENCES
    users
(
    id
) ON DELETE CASCADE,
    place_id INTEGER REFERENCES places
(
    id
)
  ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_place UNIQUE
(
    user_id,
    place_id
)
    );