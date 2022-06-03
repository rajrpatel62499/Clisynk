import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-preview-leadform',
  templateUrl: './preview-leadform.component.html',
  styleUrls: ['./preview-leadform.component.css']
})
export class PreviewLeadformComponent implements OnInit {

  constructor(public http: HttpService, public route: ActivatedRoute) { }

  // leadForm = this.fb.group({
  //   businessname:[null, [Validators.required]],
  //   firstname: [null,[Validators.required]],
  //   lastname: [null,[Validators.required]],
  //   emailaddress: [null,[Validators.required, Validators.email]],
  //   phone: [null],
  //   phoneType: ["Personal"],
  //   note: [null]
  // })

  loader = false;
  businessName: '';
  logoUrl: any;
  submitted = false;

  formData = new FormData();

  getForm(){
      this.loader = true; 
      this.http.getLeadFormById(this.route.snapshot.paramMap.get('id')).subscribe(res => {  
        console.log(res);
        if(Array.isArray(res.data.formJson.components) && res.data.formJson.components.length){
            this.formData.append("smartFormId", res["data"]._id);
            this.form = res.data.formJson;
            if(res.data.businessName){
              this.businessName = res.data.businessName;
            }
            if(res.data.businessLogo){
              this.logoUrl = res.data.businessLogo;
            }
            this.loader = false; 
        }
      }, () => {
          this.loader = false;
      });
  }

  ngOnInit() {
    this.getForm();
  }

  public form: Object = {};

  onSubmit(event){
    this.formData.append("resultJson", JSON.stringify(event.data));
    this.http.postLeadForm(this.formData).subscribe(res => {
      console.log(res);
      if(res['statusCode'] == 200){
        this.submitted = true;
      }
    });
  }
    //    "components": [
    //     {
    //         "label": "First Name",
    //         "tableView": true,
    //         "validate": {
    //             "required": true
    //         },
    //         "key": "firstName",
    //         "type": "textfield",
    //         "input": true
    //     },
    //     {
    //         "label": "Last Name",
    //         "tableView": true,
    //         "validate": {
    //             "required": true
    //         },
    //         "key": "lastName",
    //         "type": "textfield",
    //         "input": true
    //     },
    //     {
    //         "label": "Email Address",
    //         "tableView": true,
    //         "validate": {
    //             "required": true
    //         },
    //         "key": "emailAddress",
    //         "type": "textfield",
    //         "input": true
    //     },
    //     {
    //         "label": "Phone",
    //         "placeholder": "Phone",
    //         "tableView": true,
    //         "validate": {
    //             "required": true
    //         },
    //         "key": "phone",
    //         "type": "phoneNumber",
    //         "input": true
    //     },
    //     {
    //         "label": "Phone Type",
    //         "widget": "choicesjs",
    //         "tableView": true,
    //         "defaultValue": "office",
    //         "data": {
    //             "values": [
    //                 {
    //                     "label": "Personal",
    //                     "value": "personal"
    //                 },
    //                 {
    //                     "label": "Office",
    //                     "value": "office"
    //                 },
    //                 {
    //                     "label": "Home",
    //                     "value": "home"
    //                 },
    //                 {
    //                     "label": "Other",
    //                     "value": "other"
    //                 }
    //             ]
    //         },
    //         "selectThreshold": 0.3,
    //         "key": "phoneType",
    //         "type": "select",
    //         "indexeddb": {
    //             "filter": {}
    //         },
    //         "input": true
    //     },
    //     {
    //         "label": "Add Note",
    //         "autoExpand": false,
    //         "tableView": true,
    //         "key": "addNote",
    //         "type": "textarea",
    //         "input": true
    //     },
    //     {
    //         "type": "button",
    //         "label": "Submit",
    //         "key": "submit",
    //         "disableOnInvalid": true,
    //         "input": true,
    //         "tableView": false
    //     }
    // ]
}
