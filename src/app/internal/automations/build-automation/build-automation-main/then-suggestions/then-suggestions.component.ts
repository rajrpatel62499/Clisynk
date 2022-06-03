import { ApiUrl } from 'src/app/services/apiUrls';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { SubmitfeedbackComponent } from 'src/app/shared/modals/submitfeedback/submitfeedback.component';
import { AutomationService } from '../../../automation.service';
import { WhenThenEvent } from '../../../models/automation';
import { BackendResponse } from '../../../../../models/backend-response';
import { THEN_INTERNAL_EVENTS } from '../../../models/enum';

@Component({
  selector: 'app-then-suggestions',
  templateUrl: './then-suggestions.component.html',
  styleUrls: ['./then-suggestions.component.css']
})
export class ThenSuggestionsComponent implements OnInit {


  showOption = false;

  @Output()
  onSelectedEvent = new EventEmitter<any>();

  selectedEvent: WhenThenEvent;
  // listOfThenEvents = ['Send an email', 'Send notification', 'Add a tag', 'Create a task'];
  listOfThenEvents: WhenThenEvent[];
  loader: boolean = false;

  constructor(public http: HttpService,
    public automationService: AutomationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getThenEvents();
  }

  getThenEvents() {
    this.loader = true;
    this.http.getData(ApiUrl.GET_THEN_EVENTS)
      .map((res: BackendResponse<WhenThenEvent[]>) => res.data)
      .subscribe((res: WhenThenEvent[]) => {
        this.listOfThenEvents = res;
        this.listOfThenEvents.forEach(x => x.img = this.mapImage(x.eventName)); //setting Images dynamically
        this.loader = false;
      });
  }
  openSubmitfeedback() {
    this.http.showModal(SubmitfeedbackComponent);
  }


  toggleOptions() {
    this.showOption = !this.showOption
    document.body.scrollTop = 0;
    // window.scrollTo(1900, 1900);
  }

  onSelectEvent(item: WhenThenEvent) {
    delete item.img;
    this.selectedEvent = item;
    this.onSelectedEvent.emit(THEN_INTERNAL_EVENTS.on_then_event_selected);
    // TODO: Need to make it more efficient
    let group = this.automationService.createThenEventObj();
    group.patchValue(item);
    this.automationService.addToThenTasksList(group);
  }


  

  private mapImage = (eventName) => {
    switch (eventName) {
      case "sendEmail": { return 'assets/images/send-an-email-blue.svg' }
      case "sendNotification": { return 'assets/images/send-notification-blue.svg' }
      case "addTag": { return 'assets/images/tag-is-addwd-blue.svg' }
      case "tagAdded": { return 'assets/images/tag-is-addwd.svg' }
      case "createTask": { return 'assets/images/create-a-task-blue.svg' }
      case "removeTag": { return 'assets/images/tag-is-addwd.svg' }
      default: { return 'assets/images/send-an-email-blue.svg' }

    }
  }
}
