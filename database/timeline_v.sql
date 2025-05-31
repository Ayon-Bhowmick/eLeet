CREATE OR REPLACE VIEW timeline_v AS
SELECT
    s.id,
    u.username,
    s.prob_name,
    s.date_time,
    s.runtime,
    s.runtime_percent,
    s.memory,
    s.memory_percent,
    s.code
FROM solution s
JOIN user u ON s.user_id = u.id
ORDER BY s.date_time DESC;
