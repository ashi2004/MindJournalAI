# Write your MySQL query statement below
SELECT EU.unique_id, E.name from EmployeeUNI AS EU right join Employees AS E ON EU.id=E.id;