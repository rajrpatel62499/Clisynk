import { Injectable, ElementRef } from '@angular/core';
import { connect, createLocalVideoTrack } from 'twilio-video';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TwilioService {

  localVideo: ElementRef;
  remoteVideo: ElementRef;
  previewing: boolean;
  roomObj: any;
  msgSubject = new BehaviorSubject("");
  microphone = true;
  roomParticipants;
  accessToken: any;
  options: any;
  constructor() {

  }

  connectToRoom(accessToken: string, options): void {
    this.accessToken = accessToken;
    this.options = options;
    console.log('in connect function', accessToken, options)
    connect(accessToken, options).then(room => {
      console.log('connection success....', room)
      this.roomObj = room;
      this.roomParticipants = room.participants;
      //if participent already in room
      room.participants.forEach(participant => {
        console.log('participent..............', participant)
        this.attachParticipantTracks(participant);
      });

      // when participent disconnect
      room.on('participantDisconnected', (participant) => {
        console.log(participant);
        this.removeTrack();
      });

      // this.attachParticipantTracks(room.localParticipant)
      // when participent connect
      room.on('participantConnected', participant => {
        this.roomParticipants = room.participants;

        // let prFlag = false;
        // this.roomParticipants.forEach((pr) => {
        //   if (pr.sid === participant.sid) {
        //     prFlag = true;
        //   }
        // })
        // if(!prFlag)
        this.attachParticipantTracks(participant);
      });

      // when participent join existing room
      // room.on('participantConnected', participant => {
      //   this.attachParticipantTracks(participant);
      // });

      // When a Participant adds a Track, attach it to the DOM.
      // room.on('trackAdded', (track, participant) => {
      //   this.attachTracks([track]);
      // });

      // // When a Participant removes a Track, detach it from the DOM.
      // room.on('trackRemoved', (track, participant) => {
      //   this.detachTracks([track]);
      // });

      // when me left room
      room.on('disconnected', (room, error) => {
        this.removeTrack();
      });
    });
  }
  remoeLocatVideoTrack() {
    this.roomObj.localParticipant.videoTracks.forEach(video => {
      const trackConst = [video][0].track;
      trackConst.stop(); // <- error
      trackConst.detach().forEach(element => element.remove());
      this.roomObj.localParticipant.unpublishTrack(trackConst);
    });
    let element = this.remoteVideo.nativeElement;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    let localElement = this.localVideo.nativeElement;
    while (localElement.firstChild) {
      localElement.removeChild(localElement.firstChild);
    }
  }
  removeTrack() {
    console.log('rrom obj is..................', this.roomObj)
    this.roomObj.localParticipant.tracks.forEach(function (tra) {
      console.log(tra);
      tra.track.stop();
      const attachedElements = tra.track.detach();
      attachedElements.forEach(element => element.remove());
    });
    // this.roomObj.disconnect();
  }

  attachParticipantTracks(participant): void {
    participant.tracks.forEach(part => {
      console.log(part, '.....----');
      if (part.kind !== 'data')
        this.trackPublished(part);
    });
  }

  trackPublished(publication) {
    console.log(publication);

    if (publication.isSubscribed)
      this.attachTracks(publication.track);

    if (!publication.isSubscribed)
      publication.on('subscribed', track => {
        this.attachTracks(track);
      });
  }

  mute() {
    this.roomObj.localParticipant.audioTracks.forEach(function (
      audioTrack
    ) {
      audioTrack.track.disable();
    });
    this.microphone = false;
  }

  unmute() {
    this.roomObj.localParticipant.audioTracks.forEach(function (
      audioTrack
    ) {
      audioTrack.track.enable();
    });
    this.microphone = true;
  }

  startLocalVideo(): void {
    createLocalVideoTrack().then(track => {
      console.log(track);
      this.localVideo.nativeElement.appendChild(track.attach());
    });
  }

  detachParticipantTracks() {
    var tracks = Array.from(this.roomObj.localParticipant.tracks.values());
    console.log('in tracks.............', tracks)
    this.detachTracks(tracks);
  }

  detachTracks(tracks): void {
    tracks.forEach(function (track) {
      track.track.detach().forEach(function (detachedElement) {
        detachedElement.remove();
      });
    });
  }

  // add remote track
  attachTracks(track) {
    console.log('track.........................', track)
    if (track.kind !== 'data')
      this.remoteVideo.nativeElement.appendChild(track.attach());
  }
}