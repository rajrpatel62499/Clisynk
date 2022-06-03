import { SaveTemplateComponent } from './../../../../shared/modals/save-template/save-template.component';
import { HttpService } from 'src/app/services/http.service';
import { Component, Input, OnInit } from '@angular/core';
import { ApiUrl } from 'src/app/services/apiUrls';
import { Subject } from 'rxjs';

/**
 * @flow: 
 *  1. User will click or paste the code.
 *  2. Edit the code then save as a theme or can redirect to the send
 *  
 */
declare type ViewType = 'paste-in' | 'edit-code' | 'mail';
@Component({
  selector: 'code-your-own',
  templateUrl: './code-your-own.component.html',
  styleUrls: ['./code-your-own.component.scss']
})
export class CodeYourOwnComponent implements OnInit {
  
  @Input('currentTab')
  currentTab: string;
  
  showView: ViewType = 'paste-in';
  content: string = '';
  constructor(public http: HttpService) { }

  ngOnInit() {
    
  }

  changeView(view: ViewType) {
    this.showView = view;
  }

  sendEmail(eventData:{html: string, view: ViewType }) {
    this.content = eventData.html;
    this.changeView(eventData.view);
  }

  
}
