// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');

// importScripts('https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/7.19.0/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyD1FqM_Jn6UQedTzzU_Rz8IblOEwkOl_Tw",
    authDomain: "clisynk-37ff0.firebaseapp.com",
    databaseURL: "https://clisynk-37ff0.firebaseio.com",
    projectId: "clisynk-37ff0",
    storageBucket: "clisynk-37ff0.appspot.com",
    messagingSenderId: "350640028874",
    appId: "1:350640028874:web:acf6941583cdb5224b8833",
    measurementId: "G-9SYBZTCT2M"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function(payload) {
//
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     var notificationTitle = payload.data.title; //or payload.notification or whatever your payload is
//     var notificationOptions = {
//         body: payload.data.body,
//         icon: payload.data.icon,
//         data: { url:payload.data.click_action }, //the url which we gonna use later
//         actions: [{action: "open_url", title: "Read Now"}]
//     };
//
//     return self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });


self.addEventListener('notificationclick', function (event) {
    console.log('ammmm', event,window.location.origin)
    let url = 'https://test.clisynk.com';
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({type: 'window'}).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                // If so, just focus it.
                // if (client.url === url && 'focus' in client) {
                //     return client.focus();
                // }
                if (client.url.includes(url) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});


self.addEventListener('notificationclick', function(event) {

        switch(event.action){
            case 'open_url':
                clients.openWindow(event.notification.data.url); //which we got from above
                break;
            case 'any_other_action':
                clients.openWindow("https://www.example.com");
                break;
        }
    }
    , false);


