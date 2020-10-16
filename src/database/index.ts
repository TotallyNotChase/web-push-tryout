import Bluebird from 'bluebird';
import pgPromise from 'pg-promise';
import { IInitOptions, IMain } from 'pg-promise';

// User provided config
import config from '../config';

// Repos that provide functionalities on the tables
import { IExtensions, SubscriptionRepo } from './repos';

import { ExtendedProtocol } from '../types/db';

/**
 * Function to create all necessary tables
 */
async function init() {
    // Create the table(s) for subscriptions
    const subscriptionsRepo = new SubscriptionRepo(db, pgp);
    await subscriptionsRepo.create();
};

// pg-promise initialization options:
const initOptions: IInitOptions<IExtensions> = {
    // Use bluebird as promise library
    promiseLib: Bluebird,

    // Extending the database protocol with custom repos
    extend(obj: ExtendedProtocol, dc: any) {
        obj.subscriptions = new SubscriptionRepo(obj, pgp);
        obj.init = init;
    },
};

// Connect to Database
const pgp: IMain = pgPromise(initOptions);
const db: ExtendedProtocol = pgp(config.DB_CONNECTION);

export default db;
