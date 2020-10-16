/*
 Delete row with matching id from subscriptions table
 */
DELETE FROM subscriptions
WHERE id = $1