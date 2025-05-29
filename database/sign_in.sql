CREATE OR REPLACE FUNCTION sign_in(p_username VARCHAR, p_password VARCHAR)
RETURNS NUMERIC AS $$
DECLARE
    v_user_id NUMERIC;
    v_password_hash VARCHAR(255);
    v_salt VARCHAR(255);
BEGIN
    SELECT id, password_hash, salt INTO v_user_id, v_password_hash, v_salt
    FROM user
    WHERE username = username;

    -- if not found return -1
    IF NOT FOUND THEN
        RETURN -1;
    END IF;

    -- verify the password
    IF v_password_hash = crypt(p_password, v_salt) THEN
        RETURN v_user_id;
    ELSE
        RETURN -1; -- invalid password
    END IF;
END;
$$ LANGUAGE plpgsql;
