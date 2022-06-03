import { ApiUrl } from 'src/app/services/apiUrls';
import { EventNames, FormType } from './../../../models/enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WhenThenEvent } from './../../../models/automation';
import { BackendResponse } from '../../../../../models/backend-response';
import { AutomationParams } from './../../../models/params';
import { AutomationService } from './../../../automation.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { SubmitfeedbackComponent } from 'src/app/shared/modals/submitfeedback/submitfeedback.component';
import { Automation } from '../../../models/automation';
import { SmartForm } from 'src/app/models/smart-form';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-when-suggestions',
  templateUrl: './when-suggestions.component.html',
  styleUrls: ['./when-suggestions.component.css']
})
export class WhenSuggestionsComponent implements OnInit {


  showOption = false;

  selectedEvent: WhenThenEvent;

  loader: boolean = false;

  listOfWhenEvents: WhenThenEvent[];


  constructor(public http: HttpService,
    public automationService: AutomationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getWhenEvents();
  }

  getWhenEvents() {
    this.loader = true;
    return this.http.getData(ApiUrl.GET_WHEN_EVENTS)
      .map((res: BackendResponse<WhenThenEvent[]>) => res.data)
      .subscribe(res => {
        this.listOfWhenEvents = res;
        this.listOfWhenEvents.forEach(x => x.img = this.mapImage(x.eventName)); //setting Images dynamically
        this.loader = false;
      });
    ;
  }
  openSubmitfeedback() {
    this.http.showModal(SubmitfeedbackComponent);
  }

  async onSelectEvent(item: WhenThenEvent) {
    delete item.img;
    this.selectedEvent = item;

    let whenForm = this.automationService.createWhenEventObj();
    whenForm.patchValue(item);


    switch (item.eventName) {
      case EventNames.WHEN.LEAD_FORM: {
        this.loadDefaultLeadform(whenForm);
        break;
      }
      case EventNames.WHEN.APPOINTMENT_SCHEDULED: {
        // this.automationService.updateEventType()
        break;
      }
    }

    this.automationService.updateWhenEvent(whenForm);
  }

  async loadDefaultLeadform(whenForm: FormGroup) {
    const leadForm: SmartForm = await this.http.getLeadForm().pipe(map(x => x.data[0])).toPromise().then();
    whenForm.patchValue({
      eventData: {
        dataId: leadForm._id,
        params: { name: leadForm.name, formTag: FormType.LEAD_FORM }
      }
    });
    this.automationService.updateWhenEvent(whenForm);
  }


 

  toggleOptions() {
    this.showOption = !this.showOption
    document.body.scrollTop = 0;
    // window.scrollTo(1900, 1900);
  }

  private mapImage = (eventName) => {
    switch (eventName) {
      case "leadForm": { return 'assets/images/lead-form-is-submitted.svg' }
      case "appointmentScheduled": { return 'assets/images/appointment-is-scheduled.svg' }
      case "appointmentCancelled": { return 'assets/images/lead-form-is-submitted.svg' }
      case "tagAdded": { return 'assets/images/tag-is-addwd.svg' }
      case "productPurcased": { return 'assets/images/purchase-is-made.svg' }
      default: { return 'assets/images/lead-form-is-submitted.svg' }

    }
  }

}
