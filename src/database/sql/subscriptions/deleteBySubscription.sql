/*
 Delete row with matching subscription from subscriptions table
 */
DELETE FROM subscriptions
WHERE subscription = $1