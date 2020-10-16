/*
 Create table subscriptions
 */
CREATE TABLE IF NOT EXISTS subscriptions (
    id serial,
    subscription text NOT NULL UNIQUE,
    date_created timestamp NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
)