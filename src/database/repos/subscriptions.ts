import { IDatabase, IMain } from 'pg-promise';

// Types/Interfaces used in the database
import { ISubscription } from '../models';
import { subscriptionsSQL } from '../sql';

// Custom Types/Interfaces
import { SubscriptionData } from '../../types/db';

// Class to manage the subscriptions table
export class SubscriptionRepo {
    /**
     * High level API to manage subscriptions table
     * @param db Database to perform operations on
     * @param pgp pg promise object, used to access helpers
     */
    constructor(private db: IDatabase<any>, private pgp: IMain) {}

    /**
     * Creates the table(s)
     */
    create = async (): Promise<null> =>
        this.db.none({
            text: subscriptionsSQL.create,
        });

    /**
     * Drops the table(s)
     */
    drop = async (): Promise<null> =>
        this.db.none({
            text: subscriptionsSQL.drop,
        });

    /**
     * Adds a new subscription - does nothing if same subscription already exists
     */
    add = async (data: SubscriptionData): Promise<null> =>
        // Insert row in subscriptions table
        this.db.none({
            text: subscriptionsSQL.add,
            values: [data.subscription],
        });

    /**
     * Get row from subscriptions table by id
     */
    get = async (id: number): Promise<ISubscription | null> =>
        this.db.oneOrNone({ text: subscriptionsSQL.get, values: [id] });

    /**
     * Get row from subscriptions table by subscription data
     */
    getBySubscription = async (subscriptionData: string): Promise<ISubscription | null> =>
        this.db.oneOrNone({ text: subscriptionsSQL.getBySubscription, values: [subscriptionData] });

    /**
     * Get total number of rows in subscriptions table
     */
    countRows = async (): Promise<{ count: number }> =>
        this.db.one({ text: subscriptionsSQL.countRows })

    /**
     * Delete a row from subscriptions table by id
     */
    delete = async (id: number): Promise<null> =>
        this.db.none({
            text: subscriptionsSQL.delete,
            values: [id],
        });

    /**
     * Delete a row from subscriptions table by subscription data
     */
    deleteBySubscription = async (subscriptionData: string): Promise<null> =>
        this.db.none({
            text: subscriptionsSQL.deleteBySubscription,
            values: [subscriptionData],
        });
}
