import { filter } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import { Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MailTemplateListResponse, MailTemplateListData } from 'src/app/shared/models/mail-template-list.model';
import { MailTemplateResponse, MailTemplateData } from 'src/app/shared/models/mail-template.model';


/**
 * @flow: User will select the theme then send the broadcast mail.
 */
 declare type ViewType = 'choose-theme' | 'mail';

@Component({
  selector: 'choose-theme',
  templateUrl: './choose-theme.component.html',
  styleUrls: ['./choose-theme.component.scss']
})
export class ChooseThemeComponent implements OnInit {

  @Input('currentTab')
  currentTab: string;
  
  showView: ViewType = "choose-theme";
  templates: MailTemplateData[] = [];
  selectedTemplate: MailTemplateData = null;

  constructor(public http: HttpService) { }

  ngOnInit() {
    this.templateList();
  }

  chooseTemplate(template:MailTemplateData) {
    this.selectedTemplate = template;

    this.changeView('mail');
  }
  
  
  changeView(view: ViewType) {
    this.showView = view;
  }



  templateList() {
   this.http.getMailTemplates().subscribe((res: MailTemplateListResponse) => {
        let allTemplates: MailTemplateListData[] = res.data;
        const requests: any[] = [];
        allTemplates.forEach((template:MailTemplateListData) => {
            requests.push(this.http.getMailTemplateById(template._id));
        })
        forkJoin(requests)
        .subscribe((res: MailTemplateResponse[]) => {
            // this.templates = res.map(x => x.data).filter(y => !y.canDeleted); // for only selecting default templates.
            this.templates = res.map(x => x.data); //all templates
        })
    })
    console.log(this.templates);

}
}
