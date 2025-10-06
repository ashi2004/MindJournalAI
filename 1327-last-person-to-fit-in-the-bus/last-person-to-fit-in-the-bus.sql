# Write your MySQL query statement below
# Write your MySQL query statement below
select person_name from
(select person_id,person_name,weight,turn, sum(weight) over (order by turn) as total_weight from queue) as a
where total_weight <= 1000
order by total_weight desc
limit 1;