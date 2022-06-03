import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpService } from '../../services/http.service';
import { ApiUrl } from '../../services/apiUrls';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TableModel } from '../../shared/models/table.common.model';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { Subject } from 'rxjs';
import { DeleteContactComponent } from '../../shared/modals/delete-contact/delete-contact.component';
import { MatSidenav } from '@angular/material/sidenav';
import { PushNotificationsService } from 'ng-push';
// import { connect, ConnectOptions, LocalTrack, Room, createLocalTracks, TwilioError } from 'twilio-video';
import { TwilioService } from '../../services/twilio.service';
import { environment } from '../../../environments/environment';
import { SimpleTimer } from 'ng2-simple-timer';

// var FileSaver = require('file-saver');
import * as FileSaver from 'file-saver';

declare var jQuery: any;
import * as RecordRTC from 'recordrtc';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  @ViewChild('localVideo', { static: true }) localVideo: ElementRef;
  @ViewChild('remoteVideo', { static: true }) remoteVideo: ElementRef;


  forwardselectmsg = false
  mode = new FormControl('over');
  form: FormGroup;
  tab = 'chats';
  tab1 = '';
  chatModel;
  loader = true;
  forwardIds: any = []
  allSelect = new FormControl();
  simmerLoader: boolean = false;
  pinLoader: boolean = false;
  searchName = new FormControl();

  // selected name var
  showSelected = false;
  selectedIndex: number;
  selected: any;
  isBlockedBy: boolean = false;
  selectedContactCount = 0;

  groupData = [];
  activeChatList = [];
  massageArray = [];
  message: string = '';
  replayFlag = false;
  replayData;
  forwardData;
  selectedChat: any;
  forwardModalFlag = false;
  forwardMsgContact = [];
  toggled: boolean = false;

  // uplaod media array
  imageArray = [];
  docArray = [];
  videoArray = [];

  //chat search var 
  searchIndex = 0;
  searchArray = [];
  searchFlag = false;
  isRecording: boolean = false;
  loading = false;
  forwardArray = [];

  // profile var
  profileImageArray = [];
  profileLinkMsgArray = [];
  openMediaFlag = false;
  openPinMsgFlag = false;
  openCallLogFlag = false;
  profilePinArray = [];
  profileCallLogArray = [];
  profileMediaArray = [];
  allBlockUsers = [];
  unBlockFlag = false;
  defaultScreenFlag = true;
  toggleProfileOpen = true;

  msgTotal: '';
  isLoading = false;
  typingFlag = false;
  mediaLoader: boolean = false;
  mediaFlag = false;
  selectedChatIndex = '';
  searchTotalCount = 0;
  videoSrc = '';

  // call var
  videoCallToken = '';
  room: '';
  videoFlag = false;
  callStatus = "";
  callerName = '';
  callId = "";
  outgoingFlag = false;
  muteFlag = false;
  videoManage = false;
  callChatroomId = '';
  voiceFlag = false;
  voiceCallToken = "";
  outgoingVoiceFlag = false;

  outgoingData = "";

  incomingData = '';

  timerName = 'call';
  timerId = '';
  counter = 0;
  record: any;
  isRecordStart: boolean = false;

  @ViewChild('scrollMe', { static: false }) scrollDiv;
  modalRef: BsModalRef;
  pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  videoThumbnail = 'assets/images/video-thumbnail.gif'

  // socket var
  socket;
  private url = environment.apiBaseUrl;
  sound: any;
  // localstorage data
  accessToken = localStorage.getItem('accessToken');
  adminData = JSON.parse(localStorage.getItem('loginData'));
  adminId: string;

  constructor(public http: HttpService, private modalService: BsModalService, private _pushNotifications: PushNotificationsService, public httpBlob: HttpClient,
    private _sanitizer: DomSanitizer, private twilioService: TwilioService, private st: SimpleTimer) {
    this._pushNotifications.requestPermission();

    this.twilioService.msgSubject.subscribe(r => {
      this.message = r;
    });

    this.adminId = this.adminData && this.adminData._id;
    this.chatModel = new TableModel();
    this.chatModel.contactsType = '';

    this.form = this.http.fb.group({
      contactId: ['']
    })

    let token = this.accessToken;
    this.socket = io(this.url, {
      query: { token },
      transports: ["websocket"],
      reconnection: true,             // whether to reconnect automatically
      reconnectionAttempts: Infinity, // number of reconnection attempts before giving up
      reconnectionDelay: 1000,        // how long to initially wait before attempting a new reconnection
      reconnectionDelayMax: 5000,     // maximum amount of time to wait between reconnection attempts
    })

    // socket auth event
    this.socket.on('auth', data => {
      if (data) {
        console.log('socket connected', data)
      }
    })

    // socket error event
    this.socket.on('connect_error', data => {
      if (data) {
        this.socket.on('disconnect', () => {
          console.log('socket disconnect error')
        });
      }
    })

  }

  ngOnInit(): void {

    this.twilioService.localVideo = this.localVideo;
    this.twilioService.remoteVideo = this.remoteVideo;

    this.getAllActiveChat(null);
    this.getNewMassages();
    this.getUnBlockEvent();
    this.getBlockEvent();
    this.getAcknowledgement();
    this.typingMsg();
    window.scrollTo(0, 0)
    // this.msgView();
    this.msgReceived();
    this.getVideoCallEvent();
    this.getVoiceCallEvent();
    this.subscribeTimer();

  }

  getVideoCallEvent() {
    this.socket.on('video-call', (data) => {
      if (data.type == 'join') {
        console.log('video join event............................', data)
        this.callerName = data.fromUser.fullName;
        this.videoCallToken = data.accessToken;
        this.room = data.room;
        this.callId = data.callId;
        this.callChatroomId = data.chatRoomId;
        if (data.fromUser._id !== JSON.parse(localStorage.getItem('loginData'))._id) {
          // this.incomingData = data;
          console.log('----');
          // this.callerName = data.fromUser.fullName;
          this.videoFlag = true;
          this.sound = new Audio();
          this.sound.src = "/assets/call_on_me.mp3";
          this.sound.load();
          this.sound.play();
          this.videoManage = true;
          this.outgoingFlag = false;
          // this.videoCall();
        }
        else {
          // this.outgoingData = data;
          this.outgoingFlag = true;
          if (this.outgoingFlag) {
            if (this.selectedChat.chatType === 'GROUP') {
              this.callerName = this.selectedChat.groupDetails.name;
            } else {
              this.callerName = this.selectedChat.temp.fullName;
            }
          }
          this.videoFlag = false;
          this.outgoingVoiceFlag = false;
          this.videoCall();
          // this.twilioService.startLocalVideo();
        }
      }
      if (data.type == "rejected" || data.type == "ended") {
        console.log(data.type);
        this.videoManage = false;
        this.videoFlag = false;
        this.outgoingFlag = false;
        this.twilioService.removeTrack();
        $('#local').empty();
        $('#remote').empty();
      }
      if (data.type == "accepted") {
        console.log('---accepted');
        this.callStatus = '';
        // if (this.videoFlag) {
        // } else {
        // this.videoCall();
        // this.videoManage = true;
        // this.videoFlag = false;
        // if (this.outgoingFlag) {
        // if(this.room)
        // this.twilioService.startLocalVideo();
        // }
        // this.outgoingFlag = true;
        // }
      }
      if (data.type == 'userStatus') {

        if (this.selectedChat) {
          if (this.outgoingFlag) {
            if (this.selectedChat.chatType === 'GROUP') {
              this.callerName = this.selectedChat.groupDetails.name;
            } else {
              this.callerName = this.selectedChat.temp.fullName;
            }
          }
          if (data.onlineUsers && data.onlineUsers.includes(this.callChatroomId)) {
            this.callStatus = "Ringing.....";
          } else {
            this.callStatus = "Connecting....";
          }
        }
      }
    });
  }

  getVoiceCallEvent() {
    this.socket.on('audio-call', (data) => {
      console.log('data....................................', data)
      if (data.type == 'join') {
        console.log('audio join event............................', data)
        this.voiceCallToken = data.accessToken;
        this.room = data.room;
        this.callerName = data.fromUser.fullName;
        this.callId = data.callId;
        this.callChatroomId = data.chatRoomId;
        if (data.fromUser._id !== this.adminId) {
          // this.incomingData = data;
          this.voiceFlag = true;
          this.sound = new Audio();
          this.sound.src = "/assets/call_on_me.mp3";
          this.sound.load();
          this.sound.play();
          this.videoManage = true;
          this.outgoingVoiceFlag = false;
          this.callerName = data.fromUser.fullName;
          console.log(this.callerName);

        }
        else {
          // this.outgoingData = data;
          if (this.selectedChat.chatType === 'GROUP') {
            this.callerName = this.selectedChat.groupDetails.name;
          } else {
            this.callerName = this.selectedChat.temp.fullName;
          }
          this.outgoingVoiceFlag = true;
          this.voiceFlag = false;
          this.voiceCall();
          // this.twilioService.startLocalVideo();
        }
      }
      if (data.type == "rejected" || data.type == "ended") {
        console.log(data.type);
        this.videoManage = false;
        this.voiceFlag = false;
        this.outgoingVoiceFlag = false;
        this.twilioService.removeTrack();
      }
      if (data.type == "accepted") {
        this.outgoingVoiceFlag = true;
        this.videoManage = true;
        this.voiceFlag = false;
        this.st.newTimer(this.timerName, 1, true);
        this.callStatus = String(this.counter);
        // this.twilioService.startLocalVideo();
      }
      if (data.type == 'userStatus') {
        if (this.selectedChat) {
          if (this.selectedChat.chatType === 'GROUP') {
            this.callerName = this.selectedChat.groupDetails.name;
          } else {
            this.callerName = this.selectedChat.temp.fullName;
          }
          if (data.onlineUsers && data.onlineUsers.includes(this.callChatroomId)) {
            this.callStatus = "Ringing.....";
          } else {
            this.callStatus = "Connecting....";
          }
        }
      }
    });
  }

  subscribeTimer() {
    this.timerId = this.st.subscribe(this.timerName, () => this.timercallback());
  }

  timercallback() {
    this.counter++;
    console.log('counter is............', this.counter)
  }

  acceptVideoCall() {
    this.socket.emit('video-call', {
      chatRoomId: this.callChatroomId,
      type: 'accepted',
      room: this.room,
      callId: this.callId
    });
    this.sound.pause();
    this.sound.src = "";
    this.videoFlag = false;
    this.outgoingFlag = true;
    this.videoManage = true;
    this.twilioService.startLocalVideo();
    this.videoCall();
  }

  acceptVoiceCall() {
    this.socket.emit('audio-call', {
      chatRoomId: this.callChatroomId,
      type: 'accepted',
      room: this.room,
      callId: this.callId
    });
    this.sound.pause();
    this.sound.src = "";
    this.outgoingVoiceFlag = true;
    this.videoManage = true;
    this.voiceFlag = false;
    this.voiceCall();
    this.st.newTimer(this.timerName, 1, true);
  }

  declineVideoCall() {
    this.socket.emit('video-call', {
      chatRoomId: this.callChatroomId,
      type: 'rejected',
      room: this.room,
      callId: this.callId
    });
    this.sound.pause();
    this.sound.src = "";
    this.videoManage = false;
    this.videoFlag = false;
    this.outgoingFlag = false;
  }

  declineVoiceCall() {
    this.socket.emit('audio-call', {
      chatRoomId: this.callChatroomId,
      type: 'rejected',
      room: this.room,
      callId: this.callId
    });
    this.sound.pause();
    this.sound.src = "";
    this.videoManage = false;
    this.voiceFlag = false;
    this.outgoingVoiceFlag = false;
  }

  muteCall() {
    this.muteFlag = true;
    this.twilioService.mute();
  }

  unMuteCall() {
    this.muteFlag = false;
    this.twilioService.unmute();
  }

  deleteVideoCall() {
    this.socket.emit('video-call', {
      chatRoomId: this.callChatroomId ? this.callChatroomId : this.selectedChat._id,
      type: 'ended',
      room: this.room,
      callId: this.callId
    });
    this.sound.pause();
    this.sound.src = "";
    this.videoManage = false;
    this.videoFlag = false;
    this.outgoingFlag = false;
    // this.twilioService.removeTrack();
    this.twilioService.remoeLocatVideoTrack();
    this.twilioService.detachParticipantTracks();
    // $('#local').empty();
    // $('#remote').empty();
  }

  deleteVoiceCall() {
    this.socket.emit('audio-call', {
      chatRoomId: this.callChatroomId ? this.callChatroomId : this.selectedChat._id,
      type: 'ended',
      room: this.room,
      callId: this.callId
    });
    this.sound.pause();
    this.sound.src = "";
    this.videoManage = false;
    this.voiceFlag = false;
    this.outgoingVoiceFlag = false;
    if (this.twilioService.roomObj && this.twilioService.roomObj !== null) {
      this.twilioService.detachParticipantTracks();
      this.twilioService.roomObj.disconnect();
      this.twilioService.roomObj = null;
    }
  }

  videoCall() {
    console.log('----------Video Call Function -----------');

    this.twilioService.connectToRoom(this.videoCallToken, { name: this.room, video: true })
  }

  voiceCall() {
    this.twilioService.connectToRoom(this.voiceCallToken, { name: this.room, audio: true })
  }

  // video call function
  handleVideo() {
    this.videoManage = true;
    this.outgoingFlag = true;
    this.socket.emit('video-call', {
      chatRoomId: this.selectedChat._id,
      type: 'new-call'
    });
    this.twilioService.startLocalVideo();
  }

  // audio call function
  handleAudio() {
    this.videoManage = true;
    this.outgoingVoiceFlag = true;

    this.socket.emit('audio-call', {
      chatRoomId: this.selectedChat._id,
      type: 'new-call'
    });

  }

  // group tab
  redirectToGroup() {
    this.tab = 'groups';
    this.getAllGroupData(null);
  }

  // contact tab
  redirectToContact() {
    this.tab = 'allContact';
    this.getAllContact(null);
  }

  // chat search display or not
  displaySearch() {
    this.searchFlag = true;
  }

  // profile media tab
  openMedia() {
    this.tab1 = 'mediaTab';
    this.openMediaFlag = true;
    this.getProfileImages();
  }

  // default open profile
  openMediaProfile() {
    window.scrollTo(0, 0);

    this.getProfileImages();
  }

  // profile pin msgs
  openPinMsg() {
    this.openPinMsgFlag = true;
    this.pinLoader = true;
    let payload = {
      chatRoomId: this.selectedChat._id
    }
    this.http.getData(ApiUrl.PROFILE_PIN_MSG, payload).subscribe(async res => {
      this.pinLoader = false;
      if (res.data && res.data[0].messages) {
        this.profilePinArray = res.data[0].messages.reverse();
      }
    })
  }

  // profile call logs
  openCallLog() {
    this.openCallLogFlag = true;
    this.profileCallLogArray = [];
    this.loader = true;
    let payload = {
      chatRoomId: this.selectedChat._id
    }
    this.http.getData(ApiUrl.CALL_LOG, payload).subscribe(async res => {
      if (res.data && res.data) {
        this.profileCallLogArray = res.data;
        this.loader = false;
        // console.log('call logs..............',res.data)
      }
    })
  }
  recordAudio() {
    navigator.mediaDevices.enumerateDevices().then((res: any) => {
      if (res[0]['kind'] === 'audioinput') {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            let options = {
              mimeType: "audio/mp3",
              numberOfAudioChannels: 1,
              desiredSampRate: 16000,
            };
            const StereoAudioRecorder = RecordRTC.StereoAudioRecorder
            this.record = new StereoAudioRecorder(stream, options);
            this.record.record();
            this.isRecordStart = true;
            this.isRecording = true;
          }, err => {
            console.log(err);
            this.isRecordStart = false;
            this.isRecording = false;
          });
      } else {
        this.http.openSnackBar('Please check permission or connectivity of microphone.');
      }
    })
  }
  stopRecord() {
    this.isRecordStart = false;
    this.isRecording = false;
    this.record.stop((blob) => {
      let file = new File([blob], "audio" + new Date().toISOString() + '.mp3', { type: 'audio/wav' });
      console.log(file);
      let url = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      this.mediaFlag = false;
      let temp = [];
      var obj = {
        file: {
          type: 'AUDIO',
          original:
            'assets/images/loading.gif',
          thumbnail:
            'assets/images/loading.gif',
        },
        from: {
          user: this.adminId
        },
        loading: true,
        pinnedBy: [],
      }

      temp.push({ ...obj, _id: `1${1}` })
      this.massageArray = [...this.massageArray, ...temp];
      this.manageScroll();
      let formData = new FormData();
      formData.append('chatRoomId', this.selectedChat._id);
      formData.append('file', file)
      if (this.replayFlag === true) {
        formData.append('ref', this.replayData._id)
      }

      this.docArray = [];
      this.replayFlag = false;
      this.http.postChatImage(ApiUrl.SEND_IMAGE, formData).subscribe(res => {
        this.massageArray = _.without(this.massageArray, ...temp);
        this.massageArray = [...this.massageArray, ...res.data];
        this.sidebarUpdateMsg(res.data);
        this.manageScroll();
        this.message = '';
        this.loading = false;
      })

      // console.log(url['changingThisBreaksApplicationSecurity'].replace('blob:',''));
    })
    // this.record.stop(this.processRecording.bind(this));
  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  // processRecording(blob) {

  //   let url = window.URL.createObjectURL(blob);
  //   console.log("blob", blob);
  //   console.log("url", this.url);

  //   this.mediaFlag = false;
  //   let temp = [];
  //   var obj = {
  //     file: {
  //       type: 'AUDIO',
  //       original:
  //         'assets/images/loading.gif',
  //       thumbnail:
  //         'assets/images/loading.gif',
  //     },
  //     from: {
  //       user: this.adminId
  //     },
  //     loading: true,
  //     pinnedBy: [],
  //   }

  //   temp.push({ ...obj, _id: `1${1}` })
  //   this.massageArray = [...this.massageArray, ...temp];
  //   this.manageScroll();
  //   let formData = new FormData();
  //   formData.append('chatRoomId', this.selectedChat._id);
  //   formData.append('file', blob)
  //   if (this.replayFlag === true) {
  //     formData.append('ref', this.replayData._id)
  //   }

  //   this.docArray = [];
  //   this.replayFlag = false;
  //   this.http.postChatImage(ApiUrl.SEND_IMAGE, formData).subscribe(res => {
  //     this.massageArray = _.without(this.massageArray, ...temp);
  //     this.massageArray = [...this.massageArray, ...res.data];
  //     this.sidebarUpdateMsg(res.data);
  //     this.manageScroll();
  //     this.message = '';
  //     this.loading = false;
  //   })
  // }
  // modal open for clear chat confirmation
  clearChatModal(openClearChatModal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      openClearChatModal,
      Object.assign({}, { class: 'gray modal-xs' })
    );
  }

  // clear chat
  clearChat() {
    let payload = {
      chatRoomId: this.selectedChat._id
    }
    this.http.postData(ApiUrl.CLEAR_CHAT, payload).subscribe(async res => {
      if (res) {
        this.massageArray = [];
      }
    })
  }

  // close profile
  closeProfile() {
    this.openMediaFlag = false;
    this.openPinMsgFlag = false;
  }

  // back arrow from profile pages
  clickProfileBack() {
    this.toggleProfileOpen = true;
    this.openMediaFlag = false;
    this.openPinMsgFlag = false;
    this.openCallLogFlag = false;
    this.profileLinkMsgArray = [];
    this.profileMediaArray = [];
    this.tab1 = '';
  }

  // block contact
  blockContact() {
    let payload = {
      userId: this.selectedChat.temp._id
    }
    this.http.postData(ApiUrl.BLOCK_USER, payload).subscribe(async res => {
      if (res) {
        this.allBlockUsers.push(this.selectedChat.temp._id)
      }
    })
  }

  // get profile images
  getProfileImages() {
    this.mediaLoader = true;
    this.openCallLogFlag = false;
    let payload = {
      chatRoomId: this.selectedChat._id,
      type: 'MEDIA'
    }
    this.profileImageArray = [];
    this.http.getData(ApiUrl.CHAT_MSG, payload).subscribe(async res => {
      this.profileMediaArray = res.data.data;
      this.mediaLoader = false;
      res.data && res.data.data.map((img) => {
        if (img.file.type === 'IMAGE') {
          this.profileImageArray.push(img);
        }
      })
    })

  }

  // get profile links
  getProfileLink() {
    const obj = {
      chatRoomId: this.selectedChat._id
    };
    this.http.getData(ApiUrl.CHAT_MSG, obj).subscribe(async res => {
      if (res.data.data) {
        this.profileLinkMsgArray = await (res.data.data).reverse();
      }
    })
  }

  // close chat search
  closeSearchChat() {
    // this.searchArray = [];
    this.searchFlag = false;
  }

  // chat serach handle
  handleSearch(value) {
    this.searchFlag = true;
    if (value !== '') {
      let payload = {
        chatRoomId: this.selectedChat._id,
        search: value
      }
      this.http.getData(ApiUrl.MSG_SEARCH, payload).subscribe(async res => {
        if (res.data.data.length > 0) {
          this.searchArray = [];
          this.searchTotalCount = res.data.totalCount
          await res.data.data.map((msg) => {
            this.searchArray.push(msg._id)
          });
          let msgId = await this.searchArray[0];
          this.searchIndex = 1;
          document.getElementById(msgId).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
        }
      })
    }
    else {
      this.searchArray = [];
      this.searchIndex = 0;
      this.searchFlag = false;
      this.searchTotalCount = 0;
    }
  }

  // scroll to bottom button
  scrollToBottom() {
    let temp = this.massageArray.length;
    let index = this.massageArray[temp - 1]._id;
    document.getElementById(index).scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  // chat , gorup , contacts search
  generalSearch(event) {
    this.searchName = event.target.value;
    if (this.tab === 'chats') {
      this.getAllActiveChat(event.target.value);
    }
    else if (this.tab === 'groups') {
      this.getAllGroupData(event.target.value);
    }
    else {
      this.getAllContact(event.target.value);
    }

  }

  //forward modal search
  forwardSearch(event) {
    let value = event.target.value;
    console.log(value);

    this.loader = true;
    this.forwardArray = [];
    let payload = {
      search: value ? value : ''
    }
    this.http.getData(ApiUrl.CHAT_ROOM, payload, false).subscribe(async res => {
      if (res && res.data) {
        this.loader = false;
        let array = [];
        const promise = res.data.map(async element => {
          array = [...element.users, ...element.admins]
          array.filter((admin) => {
            if (admin._id !== this.adminId) {
              element.temp = admin;
            }
          })
          return element
        });
        const results = await Promise.all(promise);
        this.forwardArray = results;
      }
    })
  }

  // chat serach scroll up
  handleSearchScrollUp() {
    let msgId = this.searchArray[this.searchIndex];
    document.getElementById(msgId).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
    this.searchIndex = this.searchIndex + 1;
  }

  // chat search scroll down
  handleSearchScrollDown() {
    console.log('search index.........', this.searchIndex, this.searchArray)
    if (this.searchArray.length <= (this.searchIndex + 1)) {
      console.log('in if....')
      this.searchIndex = this.searchIndex - 1;
      let msgId = this.searchArray[this.searchIndex - 1];
      document.getElementById(msgId).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
    }
    else {
      console.log('in else')
    }
  }

  // select emoji
  handleSelection(event) {
    this.message += event.char;
  }

  // select all chat for delete
  selectAllContact() {
    if (this.allSelect.value) {
      this.showSelected = !this.showSelected;
      this.activeChatList.forEach((val) => {
        val.isSelected = true;
      });
      this.getSelectedCount();
    } else {
      this.unselectAll();
    }
  }
  selectAllContacts() {
    if (this.allSelect.value) {
      this.showSelected = !this.showSelected;
      this.chatModel.contacts.forEach((val) => {
        val.isSelected = true;
      });
      this.getSelectedCounts();
    } else {
      this.unselectAll();
    }
  }

  // select all group
  selectAllGroup() {
    if (this.allSelect.value) {
      this.showSelected = !this.showSelected;
      this.groupData.forEach((val) => {
        val.isSelected = true;
      });
      this.getSelectedCountGroup();
    } else {
      this.unselectAllGroup();
    }
  }

  // active chat
  unselectAll() {
    this.activeChatList.forEach((val) => {
      val.isSelected = false;
    });
    this.chatModel.contacts.forEach((res) => {
      res.isSelected = false;
    })
    this.selectedContactCount = 0;
    this.allSelect.patchValue('');
  }

  // group
  unselectAllGroup() {
    this.groupData.forEach((val) => {
      val.isSelected = false;
    });
    this.selectedContactCount = 0;
    this.allSelect.patchValue('');
  }

  // get selected delete count
  getSelectedCount() {
    let tempCount = 0;
    this.activeChatList.forEach((val) => {
      if (val.isSelected) {
        tempCount++;
      }
      else {
        this.allSelect.patchValue('');
      }
    });
    if (tempCount == this.activeChatList.length) {
      this.activeChatList.forEach((val) => {
        val.isSelected = true;
      });
      this.allSelect.patchValue(true)
    }
    this.selectedContactCount = tempCount;
  }
  getSelectedCounts() {
    let tempCount = 0;
    this.chatModel.contacts.forEach((val) => {
      if (val.isSelected) {
        tempCount++;
      }
      else {
        this.allSelect.patchValue('');
      }
    });
    if (tempCount == this.chatModel.contacts.length) {
      this.chatModel.contacts.forEach((val) => {
        val.isSelected = true;
      });
      this.allSelect.patchValue(true)
    }
    this.selectedContactCount = tempCount;
  }

  // get selected group count
  getSelectedCountGroup() {
    let tempCount = 0;
    this.groupData.forEach((val) => {
      if (val.isSelected) {
        tempCount++;
      }
      else {
        this.allSelect.patchValue('');
      }
    });
    if (tempCount == this.groupData.length) {
      this.groupData.forEach((val) => {
        val.isSelected = true;
      });
      this.allSelect.patchValue(true)
    }
    this.selectedContactCount = tempCount;
  }

  // delete chatroom
  deleteChatroom() {
    const modalRef = this.http.showModal(DeleteContactComponent, 'xs', this.activeChatList);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(() => {
      this.selectedChat = {};
      this.selectedContactCount = 0;
      this.http.openSnackBar('Contact have been deleted');
      this.getAllActiveChat(null);
      this.getSelectedCount();
      this.http.contactUpdatedChat();
      this.allSelect.patchValue('');
      this.defaultScreenFlag = true;
    });
  }

  getBlockEvent() {
    this.socket.on('block', (data) => {
      console.log(data.userId);
      if (this.selectedChat && this.selectedChat.temp._id === data.userId) {
        this.isBlockedBy = true;
      }
    })
  }
  getUnBlockEvent() {
    this.socket.on('unblock', (data) => {
      console.log(data.userId);
      if (this.selectedChat && this.selectedChat.temp._id === data.userId) {
        this.isBlockedBy = false;
      }
    })
  }

  // new msg get from socket
  getNewMassages() {
    this.socket.on('new-message', (data) => {
      console.log(data);
      if (data.chatRoomId._id === (this.selectedChat && this.selectedChat._id)) {
        this.massageArray = [...this.massageArray, data];
        this.getGroupMemberName();
      } else {
        this.handlePushNotification(data);
      }
      this.manageScroll();
    });
  }

  // push notification function
  handlePushNotification(data) {
    let currentUser = JSON.parse(localStorage.getItem('loginData'));
    // if (data.chatRoomId !== (this.selectedChat && this.selectedChat._id)) {
    if (data.from.user !== currentUser._id) {
      if (data.from.userType === 'ADMIN') {
        let options = {
          body: data.file ? data.file.type : data.content,
          icon: "assets/images/chat-notify-img.png"
        }
        let userName;
        this.activeChatList.map((user) => {
          console.log(user);
          if (user._id === data.chatRoomId) {
            user.admins.map((admin) => {
              if (data.from.user === admin._id) {
                userName = admin.fullName;
                user.unreadCount = (user.unreadCount ? user.unreadCount : 0) + 1;
                if (data.file) {
                  user.lastMessage.file = data.file;
                } else {
                  delete user.lastMessage.file;
                  user.lastMessage.content = data.content;
                }
              }
            })
          } else {
            userName = ''
            options.body = "You have got new message in " + data.workspaceId.name;
          }
        });
        this._pushNotifications.create(userName, options).subscribe(
          res => console.log(res),
          err => console.log(err)
        );
      } else if (data.from.userType === 'GROUP') {
        let options = {
          body: data.file ? data.file.type : data.content,
          icon: "assets/images/chat-notify-img.png"
        }
        let userName;
        this.activeChatList.map((user) => {
          console.log(user);
          if (data.chatRoomId.chatType === "GROUP") {
            if (user && user.groupDetails && (user.groupDetails.name === data.chatRoomId.name)) {
              userName = user.temp.fullName;
              user.unreadCount = (user.unreadCount ? user.unreadCount : 0) + 1;
              if (data.file) {
                user.lastMessage.file = data.file;
              } else {
                delete user.lastMessage.file;
                user.lastMessage.content = data.content;
              }
              this._pushNotifications.create(userName, options).subscribe(
                res => console.log(res),
                err => console.log(err)
              );
            }
          } else {
            if ((user.temp && user.temp._id) == (data.from && data.from.user)) {
              userName = user.temp.fullName;
              user.unreadCount = (user.unreadCount ? user.unreadCount : 0) + 1;
              if (data.file) {
                user.lastMessage.file = data.file;
              } else {
                delete user.lastMessage.file;
                user.lastMessage.content = data.content;
              }
              this._pushNotifications.create(userName, options).subscribe(
                res => console.log(res),
                err => console.log(err)
              );
            }
          }
        });

        this._pushNotifications.create(userName, options).subscribe(
          res => console.log(res),
          err => console.log(err)
        );
      } else if (data.from.userType === 'CONTACT') {
        let options = {
          body: data.file ? data.file.type : data.content,
          icon: "assets/images/chat-notify-img.png"
        }
        let userName;
        this.activeChatList.map((user) => {
          if (user._id === data.chatRoomId._id) {
            console.log(user);
            user.users.map((admin) => {
              if (data.from.user === admin._id) {
                userName = admin.fullName;
                user.unreadCount = (user.unreadCount ? user.unreadCount : 0) + 1;
                if (data.file) {
                  user.lastMessage.file = data.file;
                } else {
                  delete user.lastMessage.file;
                  user.lastMessage.content = data.content;
                }
              }
            })
          }
        });
        if (!userName) {
          userName = '';
          options.body = "You have got new message in " + data.workspaceId.name;
        }
        this._pushNotifications.create(userName, options).subscribe(
          res => console.log(res),
          err => console.log(err)
        );
      }
    }
  }


  // socket ack. event
  getAcknowledgement() {
    this.socket.on('ack', (data) => {
      this.replayFlag = false;
      this.replayData = false;
      this.message = '';
      this.forwardMsgContact = [];
      this.forwardData = '';
      if (data.message.chatRoomId == this.selectedChat._id) {
        this.massageArray = [...this.massageArray, data.message];
        this.manageScroll();
      }
      this.activeChatList.map((user) => {
        if (user._id == data.message.chatRoomId) {
          user.lastMessage.content = data.message.content;
        }
      });
    });
  }

  // get socket typing events
  typingMsg() {
    this.socket.on('typing', (data) => {
      if (data.chatRoomId == (this.selectedChat && this.selectedChat._id)) {
        this.typingFlag = true;
      }
    });
    this.socket.on('not-typing', (data) => {
      if (data.chatRoomId == (this.selectedChat && this.selectedChat._id)) {
        this.typingFlag = false;
      }
    });
  }

  // scroll to msgs and default scroll to bottom
  manageScroll() {
    if (this.massageArray.length != 0) {
      let len = this.massageArray.length - 1;
      let msgId = this.massageArray[len];
      if (len > 0) {
        setTimeout(() => {
          document.getElementById(msgId._id).scrollIntoView({ block: 'end' })
        }, 50);
      }
    }
  }

  // forward msg contact select - unselect
  onContactSelect(item) {
    var temp = this.forwardMsgContact.findIndex(o => o._id == item._id);
    if (temp === -1) {
      this.forwardMsgContact.push(item);
      console.log(this.forwardMsgContact);
    }
    else {
      this.forwardMsgContact.map((data, index) => {
        if (data._id === item._id) {
          this.forwardMsgContact.splice(index, 1)
        }
      })
    }
  }

  // forward msg socket event
  sendForwardMsg() {
    this.forwardMsgContact.map((chatRoomId) => {
      console.log(chatRoomId);
      this.socket.emit('forward', {
        chatRoomId: chatRoomId,
        messageIds: this.forwardIds
      });
    });
    this.forwardselectmsg = false;
    this.forwardIds = []
  }

  // manage unread count using socket emit view event
  msgView() {
    let array = this.massageArray;
    console.log(this.massageArray);

    if ((array.length > 0) && (array[array.length - 1].isViewed === false) && (array[array.length - 1].from.user !== this.adminId)) {
      this.socket.emit('viewed', {
        chatRoomId: this.selectedChat._id,
        messageId: this.massageArray[this.massageArray.length - 1]._id
      });
      console.log(this.activeChatList);
      console.log(this.selectedChatIndex);

      this.activeChatList[this.selectedChatIndex].unreadCount = 0;
    }
  }

  // msg viewed socket event get
  msgReceived() {
    this.socket.on('viewed', (data) => {
      this.massageArray.map((msg) => {
        if (msg._id == data.messageId) {
          msg.isViewed = true;
        }
      })
    });
  }

  // chat send msg
  sendMessage(value) {
    if (value !== '') {
      let timestamp = new Date().valueOf().toString();
      this.message = value;
      if (this.replayFlag === false) {
        this.socket.emit('new-message', {
          chatRoomId: this.selectedChat._id,
          message: { content: this.message, ref: null },
          code: timestamp
        });
        this.clickChat(this.selectedChat, this.selectedChatIndex, true);
        this.manageScroll();
      }
      else {
        this.socket.emit('new-message', {
          chatRoomId: this.selectedChat._id,
          message: { content: this.message, ref: this.replayData._id }
        });
        this.clickChat(this.selectedChat, this.selectedChatIndex, true);
        this.manageScroll();
      }
    }
  }

  // chat uplaod img
  uploadImage() {
    this.mediaFlag = false;
    let temp = [];
    var obj = {
      file: {
        type: 'IMAGE',
        original:
          'assets/images/loading.gif',
        thumbnail:
          'assets/images/loading.gif',
      },
      from: {
        user: this.adminId
      },
      loading: true,
      pinnedBy: [],
    }
    var length = this.imageArray.length;
    for (var i = 1; i <= length; i++) {
      temp.push({ ...obj, _id: `1${i + 1}` })
    }

    this.massageArray = [...this.massageArray, ...temp];
    this.manageScroll();
    let formData = new FormData();
    formData.append('chatRoomId', this.selectedChat._id);

    this.imageArray.map(singleImage => {

      formData.append('file', singleImage.file)
    });

    if (this.replayFlag === true) {
      formData.append('ref', this.replayData._id)
    }
    this.imageArray = [];
    this.replayFlag = false;
    this.http.postChatImage(ApiUrl.SEND_IMAGE, formData).subscribe(res => {
      this.massageArray = _.without(this.massageArray, ...temp);
      this.massageArray = [...this.massageArray, ...res.data];
      this.sidebarUpdateMsg(res.data);
      this.manageScroll();
      this.message = '';
    })
  }

  // update msg in sidebar when get new msg
  sidebarUpdateMsg(data) {
    this.activeChatList.map((user) => {
      if ((user._id) == data[0].chatRoomId) {
        user.lastMessage.content = data[0].file && data[0].file.type;
      }
    });
  }

  // chat uplaod doc
  uploadDoc() {
    this.mediaFlag = false;
    let temp = [];
    var obj = {
      file: {
        type: 'OTHER',
        original:
          'assets/images/loading.gif',
        thumbnail:
          'assets/images/loading.gif',
      },
      from: {
        user: this.adminId
      },
      loading: true,
      pinnedBy: [],
    }
    var length = this.docArray.length;
    for (var i = 1; i <= length; i++) {
      temp.push({ ...obj, _id: `1${i + 1}` })
    }

    this.massageArray = [...this.massageArray, ...temp];
    this.manageScroll();
    let formData = new FormData();
    formData.append('chatRoomId', this.selectedChat._id);
    this.docArray.map(singleDoc => {
      formData.append('file', singleDoc.file)
    });
    if (this.replayFlag === true) {
      formData.append('ref', this.replayData._id)
    }

    this.docArray = [];
    this.replayFlag = false;
    this.http.postChatImage(ApiUrl.SEND_IMAGE, formData).subscribe((res: any) => {
      this.massageArray = _.without(this.massageArray, ...temp);
      console.log(res.data[0]);

      if (res.data.length > 1) {
        // for (let i = 0; i < res.data.length; i++) {
        // this.massageArray = [...this.massageArray, ...res.data];
        this.getOldChat(true);
        // }
      } else {
        if (res.data.length === 1) {
          this.massageArray = [...this.massageArray, ...res.data];
          // this.massageArray.push(res.data[0])
        }
      }
      this.sidebarUpdateMsg(res.data);
      this.manageScroll();
      this.message = '';
      this.loading = false;
    })
  }

  // chat uplaod video
  uploadVideo() {
    this.mediaFlag = false;
    let temp = [];
    var obj = {
      file: {
        type: 'VIDEO',
        original:
          'assets/images/loading.gif',
        thumbnail:
          'assets/images/loading.gif',
      },
      from: {
        user: this.adminId
      },
      loading: true,
      pinnedBy: [],
    }
    var length = this.videoArray.length;
    for (var i = 1; i <= length; i++) {
      temp.push({ ...obj, _id: `1${i + 1}` })
    }
    this.massageArray = [...this.massageArray, ...temp];
    this.manageScroll();

    let formData = new FormData();
    formData.append('chatRoomId', this.selectedChat._id);

    this.videoArray.map(singleVideo => {
      formData.append('file', singleVideo.file)
    });

    if (this.replayFlag === true) {
      formData.append('ref', this.replayData._id)
    }

    this.videoArray = [];
    this.replayFlag = false;
    this.http.postChatImage(ApiUrl.SEND_IMAGE, formData).subscribe(res => {
      this.massageArray = _.without(this.massageArray, ...temp)
      this.massageArray = [...this.massageArray, ...res.data];
      this.sidebarUpdateMsg(res.data);
      this.manageScroll();
      this.message = '';
    })
  }

  // delete msg socket event
  deleteMsg(chat) {
    this.socket.emit('deleted', {
      messageId: chat._id,
      chatRoomId: this.selectedChat._id
    });
    this.massageArray.filter((data, index) => {
      if (data._id === chat._id) {
        this.massageArray.splice(index, 1)
      }
    })
  }

  // replay msg 
  replayMsg(chat) {
    this.replayFlag = true;
    this.replayData = chat;
  }

  // remove replay msg
  closeReplayMsg() {
    this.replayFlag = false;
    this.replayData = '';
  }
  forwardCheck(event, chat) {
    if (event.checked) {
      this.forwardIds.push(chat._id)
    } else {
      for (let i = 0; i < this.forwardIds.length; i++) {
        if (this.forwardIds[i] === chat._id) {
          this.forwardIds.splice(i, 1);
        }
      }
    }
  }
  // forward msg modal
  forwardMsg(openForwardModal: TemplateRef<any>, chat) {
    if (this.forwardIds.length > 0) {
      this.forwardData = chat;
      this.forwardModalFlag = true;
      this.forwardArray = this.activeChatList;
      console.log(this.forwardArray);
      this.modalRef = this.modalService.show(
        openForwardModal,
        Object.assign({}, { class: 'gray modal-md' })
      );
    } else {

    }
  }
  closeForward() {
    this.forwardselectmsg = false;
    this.forwardIds = [];
  }
  // pin msg
  pinMsg(chat) {
    let payload = {
      messageId: chat._id
    }
    this.http.postData(ApiUrl.PIN_MSG, payload).subscribe(res => {
      this.massageArray.map((msg, index) => {
        if (chat._id == msg._id) {
          this.massageArray[index].pinnedBy = this.adminId
        }
      })
    })
  }

  // unpin msg
  unpinMsg(chat) {
    let payload = {
      messageId: chat._id
    }
    this.http.postData(ApiUrl.UNPIN_MSG, payload).subscribe(res => {
      this.massageArray.map((msg, index) => {
        if (chat._id == msg._id) {
          this.massageArray[index].pinnedBy = []
        }
      })
    })
  }

  // unpin msg from profile
  unPinFromProfile(chat) {
    let payload = {
      messageId: chat._id
    }
    this.http.postData(ApiUrl.UNPIN_MSG, payload).subscribe(res => {
      this.profilePinArray.map((msg, index) => {
        if (chat._id == msg._id) {
          this.profilePinArray.splice(index, 1)
        }
      });
      this.massageArray.map((msg, index) => {
        if (chat._id == msg._id) {
          this.massageArray[index].pinnedBy = []
        }
      })
    })
  }

  // get all conatct data
  getAllContact(value?) {
    this.defaultScreenFlag = true;
    this.isRecordStart = false;
    this.isRecording = false;
    this.sidenav.close();
    let payload = {
      search: value ? value : ''
    }
    this.loader = true;
    this.http.getData(ApiUrl.CHAT_CONTACT_DATA, payload).subscribe(res => {
      this.loader = false;
      this.chatModel.contacts = res.data.data;
      this.chatModel.allData = res.data;
      this.chatModel.totalItems = res.data.totalCount;
    })
  }

  // get all group data
  getAllGroupData(value?) {
    this.allSelect.patchValue('');
    this.isRecordStart = false;
    this.isRecording = false;
    this.selectedContactCount = 0;
    this.defaultScreenFlag = true;
    this.sidenav.close();
    let payload = {
      search: value ? value : ''
    }
    this.loader = true;
    this.http.getData(ApiUrl.CHAT_GROUP_DATA, payload).subscribe(res => {
      if (res) {
        this.loader = false;
        this.groupData = res.data;
      }
    })
  }

  // get active chatroom list
  getAllActiveChat(value?) {
    this.allSelect.patchValue("");
    this.selectedContactCount = 0;
    this.isRecordStart = false;
    this.isRecording = false;
    this.defaultScreenFlag = true;
    // this.sidenav.close();
    this.loader = true;
    this.activeChatList = [];
    let payload = {
      search: value ? value : ''
    }
    this.http.getData(ApiUrl.CHAT_ROOM, payload, false).subscribe(async res => {
      if (res && res.data) {
        this.loader = false;
        this.massageArray = [];
        let array = [];
        const promise = res.data.map(async element => {
          array = [...element.users, ...element.admins]
          array.filter((admin) => {
            if (admin._id !== this.adminId) {
              element.temp = admin;
            }
          })
          return element
        });
        const results = await Promise.all(promise);
        this.activeChatList = results;
      }
    })
  }

  // get msg for perticular chat
  clickChat(data, index, loading?) {
    this.sidenav.close();
    this.isRecordStart = false;
    this.isRecording = false;
    this.defaultScreenFlag = false;
    this.selectedChat = data;
    console.log('selected chat is.......................', this.selectedChat)
    this.selectedChatIndex = index;
    this.getCurrentUser()
    if (loading) {
      this.getOldChat(true);
    } else {
      this.getOldChat();
    }
    this.fetchAllBlockUsers();
  }
  getCurrentUser() {
    this.http.getData(ApiUrl.CUR_USER, {}).subscribe((res: any) => {
      console.log(res);
      this.isBlockedBy = false;
      for (const iterator of res.data.blockedByUsers) {
        if (iterator === this.selectedChat.temp._id) {
          this.isBlockedBy = true;
          break;
        }
      }
    })
  }
  // fetch all block users
  fetchAllBlockUsers() {
    this.http.getData(ApiUrl.FETCH_BLOCK_USERS, {}).subscribe(async res => {
      res.data && res.data.map((user) => {
        this.allBlockUsers.push(user._id)
      });
    })
  }

  // unblock user modal
  unBlockUser(openUnBlockModal: TemplateRef<any>) {
    this.openPinMsgFlag = false;
    this.unBlockFlag = true;
    this.modalRef = this.modalService.show(
      openUnBlockModal,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  // block user modal
  blockUser(openUnBlockModal: TemplateRef<any>) {
    this.openPinMsgFlag = false;
    this.unBlockFlag = false;
    this.modalRef = this.modalService.show(
      openUnBlockModal,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  // unblock user
  unblock() {
    let payload = {
      userId: this.selectedChat.temp._id
    }
    this.http.postData(ApiUrl.UNBLOCK_USER, payload).subscribe(async res => {
      if (res) {
        let position = this.allBlockUsers.indexOf(payload.userId);
        this.allBlockUsers.splice(position, 1);
      }
    })
  }

  // image select with prerview in chat
  choosePhoto(event) {
    if (event.target.files && event.target.files[0]) {
      this.mediaFlag = true;
      var temp = Object.values(event.target.files);
      temp.map((file: any, index) => {
        if (file.type === 'video/mp4') {
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.videoArray.push({ file, url: event.target.result });
          }
          reader.readAsDataURL(event.target.files[index]);
        }
        else {
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.imageArray.push({ file, url: event.target.result });
          }
          reader.readAsDataURL(event.target.files[index]);
        }
      })

    }
  }

  // doc select with preview
  chooseDoc(event) {
    if (event.target.files && event.target.files[0]) {
      this.mediaFlag = true;

      var temp = Object.values(event.target.files);
      temp.map((file, index) => {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.docArray.push({ file, url: event.target.result });
        }
        reader.readAsDataURL(event.target.files[index]);
      })
    }
  }

  // delete img from preview imgs before uplaod
  deleteImage(url, index) {
    this.imageArray.splice(index, 1);
    if (this.imageArray.length == 0) {
      this.mediaFlag = false;
    }
  }

  // delete video from preview video before uplaod
  deleteVideo(url, index) {
    this.videoArray.splice(index, 1);
    if (this.videoArray.length == 0) {
      this.mediaFlag = false;
    }
  }

  // delete doc from preview doc before uplaod
  deleteDoc(url, index) {
    this.docArray.splice(index, 1);
    if (this.docArray.length == 0) {
      this.mediaFlag = false;
    }
  }

  // get chat old data
  getOldChat(showLoad?) {
    if (!showLoad) {
      this.simmerLoader = true;
    }
    const obj = {
      chatRoomId: this.selectedChat._id,
      limit: 50,
      skip: 0
    };
    this.http.getData(ApiUrl.CHAT_MSG, obj).subscribe(async res => {
      this.massageArray = await (res.data.data).reverse();
      this.getGroupMemberName();
      this.msgTotal = res.data.totalCount;
      this.simmerLoader = false;
      this.manageScroll();
      this.msgView()
    })
  }

  getGroupMemberName() {
    this.selectedChat.users = [...this.selectedChat.users, this.selectedChat.temp];
    this.selectedChat.users = this.selectedChat.users.filter((user, index) => {
      const u = JSON.stringify(user);
      return index === this.selectedChat.users.findIndex(obj => {
        return JSON.stringify(obj) === u;
      });
    })
    console.log('...................', this.massageArray, this.selectedChat.users)
    this.massageArray.length > 0 && this.massageArray.map((msg) => {
      this.selectedChat.users.map((user) => {
        console.log(user);
        if (user && msg.from.user === user._id) {
          // console.log('in if......',msg , user)
          msg.fromUserName = user.fullName ? user.fullName : user.name
        } else {
          this.selectedChat.admins.map((ad) => {
            console.log(ad);
            if (msg.from.user === ad._id) {
              msg.fromUserName = ad.fullName ? ad.fullName : ad.name
            }
          })
        }
      })
    })
  }

  // manage socket typing event
  textChange(event: any) {
    if (event.target.value.length > 0) {
      this.socket.emit('typing', { chatRoomId: this.selectedChat._id });

      setTimeout(() => {
        this.socket.emit('not-typing', { chatRoomId: this.selectedChat._id });
      }, 2000);
    }
  }

  // call api on scroll up
  onScroll(event) {

    if (event.target.offsetHeight + event.target.scrollTop >= (event.target.scrollHeight - 200)) {
      $(".scroll-to-bottom").css('display', 'none')
    }
    else {
      $(".scroll-to-bottom").css('display', 'block')
    }

    const startingScrollHeight = event.target.scrollHeight;
    if (event.target.scrollTop < 100) {
      if ((this.massageArray.length < Number(this.msgTotal)) && !this.isLoading) {
        const obj = {
          chatRoomId: this.selectedChat._id,
          limit: 50,
          skip: this.massageArray.length
        };
        this.isLoading = true;
        this.http.getData(ApiUrl.CHAT_MSG, obj).subscribe(async res => {
          const data = await (res.data.data);
          this.massageArray = [...data, ...this.massageArray];
          this.isLoading = false;

          setTimeout(() => {
            const newScrollHeight = this.scrollDiv.nativeElement.scrollHeight;
            // set the scroll height from the difference of the new and starting scroll height
            this.scrollDiv.nativeElement.scrollTo(0, newScrollHeight - startingScrollHeight);
          });
        })
      }
    }
  }

  // create chatroom from conatct
  createChatRoom(data) {
    let payload = {
      chatType: 'PRIVATE',
      dataId: data._id
    }
    this.isRecordStart = false;
    this.isRecording = false;
    this.defaultScreenFlag = false;
    this.selectedChat = data;
    this.http.postData(ApiUrl.CREATE_CHATROOM, payload).subscribe(async res => {
      console.log(res);
      if (res && res.data) {
        let array = [];
        array = [...res.data.users, ...res.data.admins]
        array.filter((admin) => {
          if (admin._id !== this.adminId) {
            res.data.temp = admin;
          }
        })

        this.selectedChat = res.data;
        console.log(this.selectedChat);
        this.getOldChat();
      }
    })
  }

  // create chatrrom from group
  createChatRoomGroup(data) {
    let payload = {
      chatType: 'GROUP',
      dataId: data._id,
      groupDetails: {
        name: data.name
      }
    }
    this.isRecordStart = false;
    this.isRecording = false;
    this.defaultScreenFlag = false;
    this.selectedChat = data;
    this.http.postChatImage(ApiUrl.CREATE_CHATROOM, payload).subscribe(async res => {
      if (res && res.data) {
        let array = [];
        array = [...res.data.users, ...res.data.admins]
        array.filter((admin) => {
          if (admin._id !== this.adminId) {
            res.data.temp = admin;
          }
        })
        this.selectedChat = res.data;
        this.getOldChat();
      }
    })
  }

  // preview image
  previewImage(url) {
    this.http.openLightBox(url)
  }

  // preview file
  previewFile(url, name) {
    FileSaver.saveAs(url, name);
  }

  playVideo(src) {
    this.videoSrc = src;
    // $('#myModal').on('show', function (e) {

    // });
    // $('#myModal').on('hide.bs.modal', function (e) {
    //   // a poor man's stop video
    //   console.log('-----');
    //   // $("#video").attr('src', src);
    //   $("#video").stop();
    // })
  }

  closeVideo() {
    console.log('-----');
    $("#video").stop();
    this.videoSrc = null;
  }
  videoURL() {
    if (this.videoSrc) {
      return this._sanitizer.bypassSecurityTrustResourceUrl(this.videoSrc)
    }
  }

  forwardselect() {
    this.forwardselectmsg = true;
  }

}
