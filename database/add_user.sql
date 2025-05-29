CREATE OR REPLACE PROCEDURE add_user(p_username VARCHAR, p_password VARCHAR)
LANGUAGE plpgsql
AS $$
DECLARE
    v_salt VARCHAR(255);
    v_password_hash VARCHAR(255);
BEGIN
    -- validate input
    IF p_username IS NULL OR p_password IS NULL THEN
        RAISE 'username or password cannot be null';
    END IF;
    IF length(p_username) < 3 OR length(p_username) > 100 THEN
        RAISE 'username must be between 3 and 100 characters';
    END IF;
    IF length(p_password) < 8 OR length(p_password) > 72 THEN
        RAISE 'password cannot be less than 8 characters or greater than 72 characters';
    END IF;

    -- this limits the password to 72 characters
    v_salt := gen_salt('bf'); -- generate a salt using blowfish
    v_password_hash := crypt(p_password, v_salt);

    INSERT INTO user (username, password_hash, salt)
    VALUES (p_username, v_password_hash, v_salt)
    ON CONFLICT (username) DO NOTHING; -- ignore if username already exists

    -- check if the insert worked
    IF NOT FOUND THEN
        RAISE 'username % already exists', p_username;
    END IF;

    RAISE NOTICE 'user % added', p_username;
END;
$$;
