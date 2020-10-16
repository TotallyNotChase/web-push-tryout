/**
 * This is a modified version of the google web-push-codelabs main script
 * It's also written in typescript instead of javascript
 */

// Hack to get typescript to respect service worker type (https://github.com/microsoft/TypeScript/issues/14877)
export default null;
declare const self: ServiceWorkerGlobalScope;

// Emit the push notification event dispatched by the backend
self.addEventListener('push', (event: PushEvent) => {
    const notif = event.data?.json();
    // Send the notification with the event data
    event.waitUntil(self.registration.showNotification(notif.title, notif.data));
});

// Handle the onclick event on the notification
self.addEventListener('notificationclick', (event: NotificationEvent) => {
    // Close the notification
    event.notification.close();
});
