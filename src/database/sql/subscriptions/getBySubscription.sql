/*
 Get row from with matching subscription from subscriptions table
 */
SELECT *
FROM subscriptions
WHERE subscription = $1