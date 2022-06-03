import { User } from 'src/app/models/user';
import { ThenEvent } from './../../../../../../models/automation';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BackendResponse } from './../../../../../../../../models/backend-response';
import { HttpService } from 'src/app/services/http.service';
import { MailTemplateListData } from './../../../../../../../../shared/models/mail-template-list.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AutomationService } from 'src/app/internal/automations/automation.service';
import { EditorContent } from 'src/app/shared/models/editor.model';
import { map, filter } from 'rxjs/operators';
import { MailTemplateData } from 'src/app/shared/models/mail-template.model';
import { ApiUrl } from 'src/app/services/apiUrls';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.css']
})
export class EmailEditorComponent implements OnInit {

  form: FormGroup ;
  ckeConfig: any = EditorContent;
  currentEmailTemplateListEdited: MailTemplateListData;
  currentThenTaskGroup: FormGroup;
  currentThenTask: ThenEvent;
  emailTemplate: MailTemplateData;
  signStatus = new FormControl();
  loginData: User;

  contacts: any = [];
  isSelected = false;

  selectedContacts = [];
  dropdownSettings: IDropdownSettings = {
    idField: '_id',
    textField: 'showName',
    itemsShowLimit: 2,
    allowSearchFilter: true,
  };

  constructor(private automationService: AutomationService, private http: HttpService) { }


  ngOnInit() {
    this.configure();
    this.contactList();
  }


  configure() {
    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.currentThenTaskGroup = _.cloneDeep(<FormGroup>this.automationService.getThenTaskByIndex());
    this.currentThenTask = this.currentThenTaskGroup.value;
    this.formInit();

    if (!this.automationService.isNullOrEmpty(this.currentThenTask.eventData.dataId) && !this.currentThenTask.eventData.params.emailData) {
      this.loadData();
    }

  }

  loadData() {
    this.http.getMailTemplateById(this.currentThenTask.eventData.dataId)
      .pipe(
        map((res: BackendResponse<MailTemplateData>) => res.data)
      ).subscribe((emailTemplate) => {
        this.emailTemplate = emailTemplate;
        this.formInit(this.emailTemplate);
      })
  }

  formInit(data?: MailTemplateData) {

    this.form = this.http.fb.group({
      name: [data && data.name ? data.name : '', Validators.required],
      fromEmails: [[]],
      subject: [data && data.subject ? data.subject : '', Validators.required],
      html: [data && data.html ? data.html : '', Validators.required],
    });

    if(this.currentThenTask.eventData.params.emailData) {
      console.log("got updated");
      const emailData = this.currentThenTask.eventData.params.emailData;
      this.form.patchValue(emailData);
    }

    this.form.valueChanges.pipe(filter(()=> this.form.valid)).subscribe(res => {
      this.currentThenTask.eventData.params.emailData = this.form.value;
      this.currentThenTaskGroup.patchValue(this.currentThenTask);
      this.automationService.updateThenTask(this.currentThenTaskGroup);
    })

    this.signStatus.valueChanges.subscribe(()=>{
      console.log(this.signStatus.value);
      // if (this.signStatus.value) {
      //   const temp = this.form.value.html + `<br><br><section class="signature-preview">
      //   <h4>${this.loginData.name}</h4> <p>${this.loginData.email}</p><p>${this.loginData.countryCode ? this.loginData.countryCode : ''}${this.loginData.phoneNumber ? this.loginData.phoneNumber : ''}</p>
      //    </section>`;
      //   this.form.controls.html.patchValue(temp);
      //   // obj.content = temp;
      // }
    })
  }

  contactList(search?) {
    this.isSelected = false;
    const obj: any = {
      skip: 0,
      limit: 100,
      search: search ? search : ''
    };
    this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
      res.data.data.forEach((val) => {
        this.http.checkLastName(val);
        if (val.email) {
          val.showName = val.showName + ` (${val.email})`;
        }
      });
      this.contacts = res.data.data;
      console.log(res);
    },
      () => {
      });
  }


}
