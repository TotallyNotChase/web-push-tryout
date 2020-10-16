/**
 * Connection config object
 */
type ConnOptions = {
    readonly host: string;
    readonly port: number;
    readonly database: string;
    readonly user: string;
    readonly password: string;
    readonly ssl?: boolean;
    readonly binary?: boolean;
    readonly client_encoding?: string;
    readonly application_name?: string;
    readonly fallback_application_name?: string;
    readonly idleTimeoutMillis?: number;
    readonly max?: number;
    readonly query_timeout?: number;
    readonly keepAlive?: boolean;
};

/**
 * User config object
 */
export type UserConfig = {
    readonly NAME: string;
    readonly PORT: number;
    readonly ENV: string;
    readonly DB_CONNECTION: ConnOptions;
    readonly PUBLIC_VAPID_KEY: string;
    readonly PRIVATE_VAPID_KEY: string;
    readonly WEB_PUSH_CONTACT: string;
};
