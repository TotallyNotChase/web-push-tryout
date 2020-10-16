/*
 Insert a new row to subscriptions table
 If the same subscription already exists, do nothing
 */
INSERT INTO subscriptions(subscription)
VALUES($1) ON CONFLICT(subscription) DO NOTHING