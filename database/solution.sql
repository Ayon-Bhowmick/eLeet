CREATE OR REPLACE TABLE solution (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    prob_name VARCHAR(100) NOT NULL UNIQUE,
    date_time TIMESTAMP NOT NULL,
    runtime NUMERIC NOT NULL,
    runtime_percent NUMERIC NOT NULL,
    memory NUMERIC NOT NULL,
    memory_percent NUMERIC NOT NULL,
    code TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
)
