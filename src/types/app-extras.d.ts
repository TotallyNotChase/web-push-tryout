import { Express } from 'express';

/**
 * Extra properties that will be present in the app object
 */
export type AppExtras = Express & {
    locals: {
        name?: string;
        PUBLIC_VAPID_KEY?: string;
    };
};
