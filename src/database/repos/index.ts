import { SubscriptionRepo } from './subscriptions';

// Database Interface Extensions:
interface IExtensions {
    // Init extension (defined in database/index.ts) - to create all necessary tables
    init: () => Promise<void>;
    // Subscriptions Repo Extension
    subscriptions: SubscriptionRepo;
}

export { IExtensions, SubscriptionRepo };
