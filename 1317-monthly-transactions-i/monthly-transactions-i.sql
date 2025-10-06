-- # Write your MySQL query statement below
-- # Write your MySQL query statement below
-- SELECT  SUBSTR(trans_date,1,7) as month, country, count(id) as trans_count, SUM(CASE WHEN state = 'approved' then 1 else 0 END) as approved_count, SUM(amount) as trans_total_amount, SUM(CASE WHEN state = 'approved' then amount else 0 END) as approved_total_amount
-- FROM Transactions
-- GROUP BY month, country


select 
date_format(trans_date, '%Y-%m') as month,
country,
Count(amount) as trans_count,
sum(state = "approved") as approved_count,
sum(amount) as trans_total_amount,
sum((state = "approved")* amount) as approved_total_amount 
from Transactions 
group by month,  country