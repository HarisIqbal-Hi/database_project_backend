ALTER TABLE achievements
    ADD CONSTRAINT achievements_unique_user_type UNIQUE (user_id, type);