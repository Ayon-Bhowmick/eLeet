CREATE OR REPLACE VIEW user_v AS
SELECT u.id, u.username, s.probs_solved, s.avg_runtime_percent, s.avg_memory_percent, s.last_solved
FROM user u
LEFT JOIN (
    SELECT user_id, count(*) AS probs_solved,
        avg(runtime_percent) AS avg_runtime_percent,
        avg(memory_percent) AS avg_memory_percent,
        max(date_time) AS last_solved
    FROM solution
    GROUP BY user_id
) s ON u.id = s.user_id;
