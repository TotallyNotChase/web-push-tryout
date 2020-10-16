import { Request, Response } from 'express';
import { PushSubscription } from 'web-push';

import db from '../database';

import { sendPushNotif } from '../webpush-handler';

/**
 * Save user subscription
 * @route PUT /subscriptions
 */
export function subscribe(req: Request, res: Response) {
    // The req.body is a stringified version of the Subscription object, save that to db
    db.subscriptions
        .add({ subscription: req.body })
        .then(() => res.status(200).json({ success: true }))
        .catch(e => {
            console.error(`Something went wrong while saving subscription: ${e}`);
            res.status(500).json({ success: false });
        });
};

/**
 * Delete user subscription
 * @route DELETE /subscriptions
 */
export function unsubscribe(req: Request, res: Response) {
    // Delete the entry in the db containing the correct stringified Subscription object
    db.subscriptions
        .deleteBySubscription(req.body)
        .then(() => res.status(200).json({ success: true }))
        .catch(e => {
            console.error(`Something went wrong while deleting subscription: ${e}`);
            res.status(500).json({ success: false });
        });
};

/**
 * Send a push notification for the client side to handle
 * @route GET /notification
 */
export async function send(req: Request, res: Response) {
    // The subscription object is base64ed into the GET parameter - construct a JSON from it
    const subscription: PushSubscription = JSON.parse(Buffer.from(req.query.sub as string, 'base64').toString());
    try {
        // Get total number of subscribers in the db
        const { count } = await db.subscriptions.countRows();
        // Get subscription entry from the database
        const subscriptionData = await db.subscriptions.getBySubscription(JSON.stringify(subscription));
        if (!subscriptionData) {
            // Subscription entry does not exist in the database
            console.error(`Invalid subscription passed to notification send call`);
            return res.status(400).json({ success: false });
        }
        // Construct notification with some data from the db
        const notifData = {
            body: `You're one of the ${count} subscriber(s) of this service!\nYou subscribed on ${subscriptionData.date_created.toUTCString()}`,
        };
        // Send the push notification
        await sendPushNotif(subscription, JSON.stringify({ title: 'Push demo', data: notifData }));
        return res.status(200).json({ success: true });
    } catch (e) {
        console.error(`Something went wrong while sending push notification: ${e}`);
        return res.status(500).json({ success: false });
    }
};
