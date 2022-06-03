import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventType } from '../../../automation-constants';
import { AutomationService } from '../../../automation.service';

@Component({
  selector: 'app-automation-header',
  templateUrl: './automation-header.component.html',
  styleUrls: ['./automation-header.component.css']
})
export class AutomationHeaderComponent implements OnInit {

  $eventSelected: Observable<EventType>;
  EventType = EventType;

  constructor( public automationService: AutomationService, private http: HttpService) { }

  ngOnInit() {
    this.$eventSelected = this.automationService.eventSelected;
  }
  async saveAutomation(){
      
    (await this.automationService.saveAutomation()).subscribe(automation => {
      console.log('saved');
      this.automationService.automation = automation;
      this.http.showToaster('Automation Saved Successfully!');
    });
  }
}
