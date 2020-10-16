import path from 'path';
import { QueryFile, utils } from 'pg-promise';

// Type(s) for each query object for folder defined in sql/
type SubscriptionsSQL = {
    readonly add: QueryFile;
    readonly countRows: QueryFile;
    readonly create: QueryFile;
    readonly delete: QueryFile;
    readonly deleteBySubscription: QueryFile;
    readonly drop: QueryFile;
    readonly get: QueryFile;
    readonly getBySubscription: QueryFile;
};

// SQL directory path(s)
const subscriptionsSQLPath = path.join(__dirname, 'subscriptions');

// Utility function to generate QueryFile for each sql in given directory path
function sql(fullPath: string) {
    return utils.enumSql(fullPath, {}, file => {
        const qf: QueryFile = new QueryFile(file, { minify: true });
        if (qf.error) {
            console.error(`Error during parsing query for ${file}`);
            process.exit(1);
        }
        return qf;
    });
}

// SQL QueryFile object(s), grouped according to the table
export const subscriptionsSQL: SubscriptionsSQL = sql(subscriptionsSQLPath);
