import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { AutomationService } from './../../../automation.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { EventType } from '../../../automation-constants';
import { AutomationURL } from '../../../automation-routes';

@Component({
  selector: 'app-automation-preview',
  templateUrl: './automation-preview.component.html',
  styleUrls: ['./automation-preview.component.css']
})
export class AutomationPreviewComponent implements OnInit {

  eventSelected = EventType.WHEN;
  EventType = EventType;
  $thenTasks: Observable<FormArray>;
  $whenEvent: Observable<FormGroup>;
  
  color = "#eb6a3a";
  constructor(private automationService: AutomationService,
    private router: Router
    ) { }

  ngOnInit() {
    this.$thenTasks = this.automationService.thenTasks;
    this.$whenEvent = this.automationService.whenEvent;
    this.automationService.eventSelected.subscribe(res => this.eventSelected = res);
  }

   updateEventType(eventType: EventType) {
    if (this.eventSelected != EventType.WHEN && this.eventSelected != EventType.THEN) {
      // Used to disabling the selecting event from preview while in edit mode.
      return;
    }

    this.automationService.updateEventType(eventType);
    this.router.navigate(["/automation/build-automation-main"])
  }

}
