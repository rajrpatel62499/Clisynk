import { WhenEvent } from './../../../models/automation';
import { EventNames, TIME_TYPES, DELAY_TYPES } from './../../../models/enum';
import { LeadFormDeletedComponent } from 'src/app/shared/modals/lead-form-deleted/lead-form-deleted.component';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { EventType, Images } from '../../../automation-constants';
import { Subject } from 'rxjs';
import { AutomationService } from '../../../automation.service';
import { Router } from '@angular/router';
import { CardHelperFunctions } from "./card-helper-functions";
import { ThenEvent } from '../../../models/automation';
@Component({
  selector: 'app-display-card',
  templateUrl: './display-card.component.html',
  styleUrls: ['./display-card.component.css'],
})
export class DisplayCardComponent extends CardHelperFunctions implements OnInit {

  statusImages = Images;
  TIME_TYPES = TIME_TYPES;
  DELAY_TYPES = DELAY_TYPES;
  random: string;
  EventType = EventType;
  EventNames = EventNames;

  eventType: string;

  @Input()
  index: number = 0;

  whenEvent: WhenEvent;
  thenEvent: ThenEvent;

  _taskData: FormGroup;
  @Input()
  set taskData(value: FormGroup) {
    if (value) {
      this._taskData = value;
      console.log(this._taskData.value);
    }
  }

  public get cardStatus(): string {
    switch (this.eventType) {
      case EventType.WHEN: {
        return this.statusImages.greenCloud;
      }
      case EventType.THEN: {
        return this.statusImages.blueFlash;
      }
    }
  }

  constructor(public changeDetection: ChangeDetectorRef,
    public automationService: AutomationService,
    public router: Router,
    public http: HttpService) {

    super(changeDetection, automationService, router, http);
    this.random = this.makeid(15);
  }

  ngOnInit() {
    console.log(this.random);
    this.automationService.eventSelected.subscribe(res => {
      this.eventType = res;
      if (this.eventType == EventType.WHEN) {
        this.whenEvent = this._taskData.value;
      } else if (this.eventType == EventType.THEN) {
        this.thenEvent = this._taskData.value;
      }
    });
  }


  onEditTask() {
    switch (this._taskData.value.eventName) {
      case EventNames.WHEN.LEAD_FORM: {
        this.automationService.updateEventType(EventType.WHEN_EDIT_LEAD_FORM);
        break;
      }
      case EventNames.WHEN.APPOINTMENT_SCHEDULED: {
        this.automationService.updateEventType(EventType.WHEN_EDIT_APPOINTMENT_SCHEDULED);
        break;
      }
      case EventNames.WHEN.APPOINTMENT_CANCELED: {
        this.automationService.updateEventType(EventType.WHEN_EDIT_APPOINTMENT_CANCELED);
        break;
      }
      case EventNames.WHEN.TAG_ADDED: {
        this.automationService.updateEventType(EventType.WHEN_EDIT_TAG_ADDED);
        break;
      }
      case EventNames.WHEN.PRODUCT_PURCHASED: {
        this.automationService.updateEventType(EventType.WHEN_EDIT_PRODUCT_PURCHASED);
        break;
      }
      case EventNames.THEN.SEND_EMAIL: {
        this.automationService.currentThenTaskIndex = this.index;

        const currentTask = this.automationService.getThenTaskByIndex(this.index);
        if (currentTask && (currentTask.value as ThenEvent).eventData.dataId) { // in editMode
          this.automationService.updateEventType(EventType.THEN_EDIT_SEND_EMAIL_SELECT);
          return;
        }
        this.automationService.updateThenTask(this._taskData, this.index);
        this.automationService.updateEventType(EventType.THEN_EDIT_SEND_EMAIL);
        break;
      }
    }
  }

  onEditTimer() {
    this.automationService.currentThenTaskIndex = this.index;
    this.automationService.updateThenTask(this._taskData, this.index);
    this.automationService.updateEventType(EventType.THEN_TIME_SCHEDULE);
  }

  goTo() {
    switch (this._taskData.value.eventName) {
      case EventNames.WHEN.LEAD_FORM: {
        this.goToLeadFormPreview();
        break;
      }
      case EventNames.WHEN.TAG_ADDED: {
        this.goToManageTags();
        break;
      }
      case EventNames.WHEN.PRODUCT_PURCHASED: {
        this.goToManageProducts();
        break;
      }
    }
  }


  onDeleteTask() {
    const modalRef = this.http.showModal(LeadFormDeletedComponent, 'xs navigated-to-lead');
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe((res) => {
      if (res) {
        switch (this.eventType) {
          case EventType.WHEN: {
            this.automationService.updateWhenEvent(null);
            break;
          }
          case EventType.THEN: {
            this.automationService.removeThenTaskFromList(this.index);
            break;
          }
        }

      }
    });
  }




}


