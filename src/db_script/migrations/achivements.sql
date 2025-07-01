ALTER TABLE achievements ADD CONSTRAINT unique_user_type UNIQUE (user_id, type);
