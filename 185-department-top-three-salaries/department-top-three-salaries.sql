# Write your MySQL query statement below
with employee_dept as 
(select d.id, d.name as Department,salary as Salary,e.name as Employee, dense_rank()over(partition by d.id order by salary desc) as rnk from department as d
join
employee as e on d.id=e.departmentId
)
select Department,Employee,Salary from employee_dept where rnk<=3;