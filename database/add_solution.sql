CREATE OR REPLACE PROCEDURE add_solution(
    p_username VARCHAR,
    p_prob_name VARCHAR,
    p_date_time TIMESTAMP,
    p_runtime NUMERIC,
    p_runtime_percent NUMERIC,
    p_memory NUMERIC,
    p_memory_percent NUMERIC,
    p_code TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id NUMERIC;
BEGIN
    IF p_username IS NULL OR p_prob_name IS NULL OR p_date_time IS NULL OR
       p_runtime IS NULL OR p_runtime_percent IS NULL OR
       p_memory IS NULL OR p_memory_percent IS NULL OR p_code IS NULL THEN
        RAISE 'all parameters must be provided and cannot be null';
    END IF;
    IF length(p_prob_name) < 1 OR length(p_prob_name) > 255 THEN
        RAISE 'problem name must be between 1 and 255 characters';
    END IF;
    IF p_runtime < 0 OR p_runtime_percent < 0 OR p_memory < 0 OR p_memory_percent < 0 THEN
        RAISE 'runtime and memory values must be non-negative';
    END IF;

    -- get the user id from the username
    SELECT id INTO v_user_id
    FROM user
    WHERE username = p_username;

    -- if user not found, raise an error
    IF NOT FOUND THEN
        RAISE 'user % not found', p_username;
    END IF;

    INSERT INTO solution (
        user_id,
        prob_name,
        date_time,
        runtime,
        runtime_percent,
        memory,
        memory_percent,
        code
    )
    VALUES (
        v_user_id,
        p_prob_name,
        p_date_time,
        p_runtime,
        p_runtime_percent,
        p_memory,
        p_memory_percent,
        p_code
    )
    ON CONFLICT (user_id, prob_name, date_time) DO NOTHING;

    -- check if the insert worked
    IF NOT FOUND THEN
        RAISE 'solution for user % and problem % at time % already exists', p_username, p_prob_name, p_date_time;
    END IF;
END;
$$;
