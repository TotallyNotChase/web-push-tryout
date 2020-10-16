import { IDatabase } from 'pg-promise';

// Extensions from the repos
import { IExtensions } from '../database/repos';
import { ISubscription } from '../database/models';

/**
 * Type for the database object, containing all the extensions
 */
export type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

/**
 * Type for the object passed to db.subscriptions.add
 */
export type SubscriptionData = Omit<ISubscription, 'date_created' | 'id'>;
