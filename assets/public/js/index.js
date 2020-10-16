/*
 * This is a modified version of the google web-push-codelabs main script
 */
'use strict';

// Store the elements that this script will be operating on
const subscribeBtn = document.getElementById('subscribe-btn');
const pushBtn = document.getElementById('push-btn');

// Set up some global constants
const appPublicKey = document.getElementById('vapid-key').value;
const baseURL = window.location.origin;

// Variables to keep track of user registration
let isSubscribed = false;
let swRegister = null;

// Function to turn a base64 string to Uint8 array - from google codelabs
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

// Update the subscribeBtn state according to the notification acceptance status
const updateSubBtn = () => {
    if (Notification.permission === 'denied') {
        subscribeBtn.textContent = 'Push Messaging Blocked.';
        subscribeBtn.disabled = true;
        return;
    }
    if (isSubscribed) {
        subscribeBtn.textContent = 'Disable Push Messaging';
    } else {
        subscribeBtn.textContent = 'Enable Push Messaging';
    }
    subscribeBtn.disabled = false;
};

// Update the pushBtn state according to the subscription status
const updatePushBtn = () => {
    if (isSubscribed) {
        pushBtn.disabled = false;
    } else {
        pushBtn.disabled = true;
    }
};

// Save user subscription
const subscribeUser = async () => {
    // Convert the VAID public key to a uint8array
    const applicationServerKey = urlB64ToUint8Array(appPublicKey);
    try {
        // Subscribe the user and get a subscription object back
        const subscription = await swRegister.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey,
        });
        const res = await updateSubscriptionOnServer(subscription);
        if (res.ok) {
            isSubscribed = true;
        } else {
            console.error('Backend failed saving subscription');
        }
    } catch (e) {
        console.error(`Could not subscribe user: ${e}`);
    }
    // Update the subscribe button
    updateSubBtn();
    // Update the push button
    updatePushBtn();
};

// Delete user subscription
const unsubscribeUser = async () => {
    try {
        // Delete the current subscription
        const subscription = await swRegister.pushManager.getSubscription();
        // Delete from backend first
        const res = await deleteSubscriptionOnServer(subscription);
        if (res.ok) {
            // Unsubscribe from the push web api
            await subscription.unsubscribe();
            isSubscribed = false;
        } else {
            console.error('Backend failed deleting subscription');
        }
    } catch (e) {
        console.error(`Could not unsubscribe user: ${e}`);
    }
    // Update the subscribe button
    updateSubBtn();
    // Update the push button
    updatePushBtn();
};

// Send push notification upon push button click
const sendPush = async () => {
    try {
        // Get the current subscription object
        const subscription = await swRegister.pushManager.getSubscription();
        // Send it to the backend and let the backend emit a push event
        const res = await initiatePushOnServer(subscription);
        if (!res.ok) {
            console.error('Backend failed emitting push event');
        }
    } catch (e) {
        console.error(`Could not send push notification: ${e}`);
    }
};

// Put given subscription object into the backend
const updateSubscriptionOnServer = async subscription => {
    return await fetch(`${baseURL}/subscriptions`, {
        method: 'PUT',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// Delete given subscription object from the backend
const deleteSubscriptionOnServer = async subscription => {
    return await fetch(`${baseURL}/subscriptions`, {
        method: 'DELETE',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// Send a GET request to the backend to let it send the push
const initiatePushOnServer = async subscription => {
    /**
     * NOTE: Passing the subscription object in a GET
     * request is NOT ideal. However, since this is a small demo,
     * and does not implement sessions/account systems - this is the ideal way
     *
     * Ideally, the subscription saved in the backend should be used instead
     * which can be identified through user session
     */
    const param = new URLSearchParams();
    // Stringify and base64 the subscription object, then attach it to a URL search param
    param.set('sub', btoa(JSON.stringify(subscription)));
    // Attach the param
    const url = `${baseURL}/notification?` + param;
    return await fetch(url, {
        method: 'GET',
    });
};

// Initiallize the functionalities of all the primary push handlers
const init = async () => {
    // Add an onclick listener on the subscribe button to manage subscriptions/unsubscriptions
    subscribeBtn.addEventListener('click', async () => {
        subscribeBtn.disabled = true;
        if (isSubscribed) {
            await unsubscribeUser();
        } else {
            await subscribeUser();
        }
    });
    // Add an onclick listener on the push button to send the notification itself
    pushBtn.addEventListener('click', async () => {
        pushBtn.disabled = true;
        if (isSubscribed) {
            await sendPush();
            pushBtn.disabled = false;
        } else {
            // User isn't subscribed - do nothing
            pushBtn.disabled = false;
        }
    });
    // Get the initial subscription value
    const subscription = await swRegister.pushManager.getSubscription();
    isSubscribed = !(subscription === null);
    if (isSubscribed) {
        // Update the backend with the subscription value (if it exists)
        await updateSubscriptionOnServer(subscription);
    }
    // Update the subscription button status
    updateSubBtn();
    // Update the push button status
    updatePushBtn();
};

// Make sure service worker is supported in the current browser, and register it
if ('serviceWorker' in navigator && 'PushManager' in window) {
    // Register the service worker
    navigator.serviceWorker
        .register(`${baseURL}/js/sw.js`)
        .then(swReg => {
            swRegister = swReg;
            // Set up the button and initial state
            init()
                .then(() => {})
                .catch(e => console.error(`Could not initiallize UI: ${e}`));
        })
        .catch(e => console.error(`Could not register service worker: ${e}`));
} else {
    console.error('Push messaging is not supported');
}
