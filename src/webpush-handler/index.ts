import webpush, { PushSubscription, SendResult } from 'web-push';

// User provided config
import config from '../config';

/**
 * Function to set up the VAPID details required for the web push standard
 */
export const setUpVAPID = () =>
    webpush.setVapidDetails(config.WEB_PUSH_CONTACT, config.PUBLIC_VAPID_KEY, config.PRIVATE_VAPID_KEY);

/**
 * Function to send a push notification with given data through web-push
 */
export const sendPushNotif = async (subscription: PushSubscription, notif: string) => {
    const result: SendResult = await webpush.sendNotification(subscription, notif);
    console.log(`Push was successful, result: ${JSON.stringify(result)}`);
};
