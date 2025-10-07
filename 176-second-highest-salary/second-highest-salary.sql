# Write your MySQL query statement below
WITH ranked AS (
  SELECT *, dense_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employee
)
SELECT max(salary) as SecondHighestSalary
FROM ranked
WHERE rnk = 2 ;