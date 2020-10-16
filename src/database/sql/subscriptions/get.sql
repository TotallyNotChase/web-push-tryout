/*
 Get row from with matching id from subscriptions table
 */
SELECT *
FROM subscriptions
WHERE id = $1