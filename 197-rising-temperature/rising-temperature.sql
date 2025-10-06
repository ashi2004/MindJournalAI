# Write your MySQL query statement below
-- SELECT w2.id AS Id
-- FROM weather AS w2
-- JOIN weather AS w1
-- ON DATEDIFF(w2.recordDate, w1.recordDate) = 1
-- WHERE w2.temperature > w1.temperature;
SELECT 
    w2.id
FROM 
    Weather w1, Weather w2
WHERE 
    DATEDIFF(w2.recordDate, w1.recordDate) = 1 
AND 
    w2.temperature > w1.temperature;