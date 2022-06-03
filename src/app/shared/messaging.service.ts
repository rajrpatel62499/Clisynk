import {Injectable} from '@angular/core';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {mergeMapTo} from 'rxjs/operators';
import {take} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {HttpService} from '../services/http.service';

@Injectable(
        {
            providedIn: 'root'
        }
)
export class MessagingService {

    currentMessage = new BehaviorSubject(null);

    constructor(public http: HttpService,
                private angularFireMessaging: AngularFireMessaging
    ) {
        this.angularFireMessaging.messaging.subscribe(
                (_messaging) => {
                    _messaging.onMessage = _messaging.onMessage.bind(_messaging);
                    _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
                }
        );
    }

    /**
     * update token in firebase database
     *
     * @param userId userId as a key
     * @param token token as a value
     */
    updateToken(userId, token) {
        // we can change this function to request our backend service
        localStorage.setItem('deviceToken', token);
        this.http.updateDeviceToken();
    }

    /**
     * request permission for notification from firebase cloud messaging
     *
     * @param userId userId
     */
    requestPermission(userId) {
        this.angularFireMessaging.requestToken.subscribe(
                (token) => {
                    this.updateToken(userId, token);
                },
                (err) => {
                    console.error('Unable to get permission to notify.', err);
                }
        );
    }

    /**
     * hook method when new notification received in foreground
     */
    receiveMessage() {
        this.angularFireMessaging.messages.subscribe(
                (payload) => {
                    console.log('new message received. ', payload);
                    this.currentMessage.next(payload);
                });
    }

}
