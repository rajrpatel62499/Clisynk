import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ExtendedComponentSchema, FormBuilderComponent, FormioComponent, FormioForm } from 'angular-formio';

class FormBuilderChangeEvent  { 
    path: string
    index: number
    type:string
    component: ExtendedComponentSchema
    form:{ components: ExtendedComponentSchema[]}
    parent:{ components: ExtendedComponentSchema[]}
  }
@Component({
  selector: 'app-smart-form-create',
  templateUrl: './smart-form-create.component.html',
  styleUrls: ['./smart-form-create.component.css']
})
export class SmartFormCreateComponent implements OnInit {
//   @ViewChild('json') jsonElement?: ElementRef;
//   @ViewChild('formName', { static: false }) formName;

    @ViewChild('smartForm', {static: true}) 
    smartFormbuilderRef: FormBuilderComponent

    public formInfo: FormGroup = this.fb.group({
        formName: ['', Validators.required],
        formDescription: ['']
    });
    public modalData: any;
    public onClose: Subject<boolean>;
    public smartFormBuilder: FormioForm;
    public formToBeSend: FormioForm;
    
    public formData: FormData = new FormData();
    public published = false;
    public update = false;

      
  constructor(public http:HttpService, private fb: FormBuilder, public router: Router, public route: ActivatedRoute) { 
      this.smartFormBuilder = this.getDefaultForm();
      this.formToBeSend = this.smartFormBuilder;
  }

  ngOnInit() {
    this.getSmartFormData();  
    if(this.modalData){
        this.updateForm(this.modalData);
    }
  }
  
  getSmartFormData(){ 
      this.http.getSmartForm().subscribe(res => {
    });
  }  

  onPublish(){
    if(this.update){
        this.formData.append("name", this.formInfo.value.formName);
        this.formData.append("description", this.formInfo.value.formDescription);
        this.formData.append("formJson", JSON.stringify(this.formToBeSend));
        this.formData.append("status", "PUBLISHED");
        this.http.updateSmartForm(this.formData, this.modalData._id).subscribe(res => {
            // console.log(res);
            this.router.navigate([]).then(result => {  window.open("/preview-smartform/" + res["data"]._id, '_blank'); });
            this.onClose.next(true);
            this.http.updateSmartFormList();
        });
        this.published = true;
        this.update = false;
    }
    // console.log(this.formInfo.value.formName);
    else{
        if(!this.formInfo.value.formDescription){
            this.formInfo.value.formDescription = "---";
        }
        this.formData.append("name", this.formInfo.value.formName);
        this.formData.append("description", this.formInfo.value.formDescription);
        this.formData.append("formJson", JSON.stringify(this.formToBeSend));
        this.formData.append("status", "PUBLISHED");
        this.http.postSmartForm(this.formData).subscribe(res => {
            // console.log(res);
            this.router.navigate([]).then(result => {  window.open("/preview-smartform/" + res["data"]._id, '_blank'); });
            this.onClose.next(true);
            this.http.updateSmartFormList();
        });
        this.published = true;
    }
  }

  onDraft(){
    if(this.update){
        if(!this.published){
            this.formData.append("name", this.formInfo.value.formName);
            this.formData.append("description", this.formInfo.value.formDescription);
            this.formData.append("formJson", JSON.stringify(this.formToBeSend));
            this.formData.append("status", "DRAFT");
            this.http.updateSmartForm(this.formData, this.modalData._id).subscribe(res => {
                this.onClose.next(true);
                this.http.updateSmartFormList();
            });
        }
        this.update = false;
    }
    else{
        if(!this.published){
            if(!this.formInfo.value.formName && !this.formInfo.value.formDescription){
                this.formData.append("name", "Untitled Form");
                this.formData.append("description", "---");
            }
            else if(!this.formInfo.value.formName){
                this.formData.append("name", "Untitled Form");
                this.formData.append("description", this.formInfo.value.formDescription);
            }
            else if(!this.formInfo.value.formDescription){
                this.formData.append("name", this.formInfo.value.formName);
                this.formData.append("description", "---");
            }
            else{
                this.formData.append("name", this.formInfo.value.formName);
                this.formData.append("description", this.formInfo.value.formDescription);
            }
            this.formData.append("formJson", JSON.stringify(this.formToBeSend));
            this.formData.append("status", "DRAFT");
            this.http.postSmartForm(this.formData).subscribe(res => {
                console.log(res);
                this.onClose.next(true);
                this.http.updateSmartFormList();
            });
        }}
  }

  updateForm(data){
      console.log(data);
      this.smartFormBuilder = data.formJson;
      const { name, description } = data;
        this.formInfo.patchValue({
            formName: name, 
            formDescription: description
        });
    this.formToBeSend = this.smartFormBuilder;
    console.log(this.formInfo);
    this.update = true;
  }

  onChange(event: FormBuilderChangeEvent) {
    // console.log(event);
    // this.JsonRef.nativeElement.innerHTML = '';
    // this.JsonRef.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 2)));
    if(event.form){
        this.formToBeSend = event.form;
    }
    if(event.type == "deleteComponent")
    {
      if(event.component.key === "email"){
        console.log("default deleted");
        event.form.components.splice(event.index,0, event.component);
        this.http.openSnackBar("You Cannot Delete Default Form Fields !!", "OK");
        this.smartFormbuilderRef.rebuildForm(event.form);
        this.formToBeSend = event.form;
        }else {
            console.log("extra deleted");
            this.smartFormbuilderRef.rebuildForm(event.form);
            this.formToBeSend = event.form;
        }
    } else if(event.type == "addComponent"){
        this.smartFormbuilderRef.rebuildForm(event.form);
        this.formToBeSend = event.form;
    } else {
        console.log("----");
    }
    console.log(this.formToBeSend);
  }

  private getDefaultForm(): FormioForm {
      return {
        components: [
            {
              "label": "First Name",
              "placeholder": "First Name",
              "tableView": true,
              "validateOn": "blur",
              "validate": {
                  "required": true
              },
              "key": "firstName",
              "type": "textfield",
              "input": true
          },
          {
              "label": "Last Name",
              "placeholder": "Last Name",
              "tableView": true,
              "validateOn": "blur",
              "validate": {
                  "required": true
              },
              "key": "lastName",
              "type": "textfield",
              "input": true
          },
          {
              "label": "Email address",
              "placeholder": "Email address",
              "tableView": true,
              "validateOn": "blur",
              "validate": {
                  "required": true,
              },
              "unique": true,
              "key": "email",
              "kickbox": {
                  "enabled": true
                },
              "type": "email",
              "input": true
          },
          {
              "label": "Phone",
              "placeholder": "Phone",
              "tableView": true,
              "unique": true,
              "errorLabel": "Invalid phone number",
              "key": "phone",
              "type": "phoneNumber",
              "labelWidth": 20,
              "input": true
          },
          {
              "label": "Type",
              "widget": "choicesjs",
              "placeholder": "Type",
              "tableView": true,
              "data": {
                  "values": [
                      {
                          "label": "Personal",
                          "value": "personal"
                      },
                      {
                          "label": "Office",
                          "value": "office"
                      },
                      {
                          "label": "Home",
                          "value": "home"
                      },
                      {
                          "label": "Other",
                          "value": "other"
                      }
                  ]
              },
              "dataType": "string",
              "selectThreshold": 0.3,
              "key": "type",
              "type": "select",
              "indexeddb": {
                  "filter": {}
              },
              "input": true
          },
          {
              "label": "Note",
              "placeholder": "Add a note here..",
              "autoExpand": false,
              "tableView": true,
              "key": "note",
              "type": "textarea",
              "input": true
          },
          {
              "type": "button",
              "label": "Submit",
              "key": "submit",
              "disableOnInvalid": true,
              "input": true,
              "tableView": false
          }
          ]
    };
  }

}
