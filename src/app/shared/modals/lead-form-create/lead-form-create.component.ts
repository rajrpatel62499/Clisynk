import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
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
  selector: 'app-lead-form-create',
  templateUrl: './lead-form-create.component.html',
  styleUrls: ['./lead-form-create.component.css']
})
export class LeadFormCreateComponent implements OnInit {
      formInfo = this.fb.group({
          formName: [''],
          formDescription: ['']
      })
      modalData: any;
      public onClose: Subject<boolean>;
      public form: Object = {};
      formData = new FormData();
      public tempForm:FormioForm;
      public formToBeSend: FormioForm;
      published = false;
      update = false;
          
      

      @ViewChild('myForm', {static: true}) 
      leadFormbuilder: FormBuilderComponent
  
      constructor(public http:HttpService, private fb: FormBuilder,public changeDetect: ChangeDetectorRef) { }
  
      ngOnInit() { 
        this.formData.append("businessName", "");
        if(this.modalData){
            this.updateForm(this.modalData);
        }
      }
      onUpdate(){
        // if(this.formToBeSend.){
        // }

        if(!this.formInfo.value.formDescription){
            this.formInfo.value.formDescription = "---";
        }
        // this.obj.name = this.formInfo.value.formName;
        // this.obj.description = this.formInfo.value.formDescription;
        // this.obj.formJson = this.formToBeSend;
        this.formData.set("businessName", this.formInfo.value.formName);
        this.formData.append("description", this.formInfo.value.formDescription);
        this.formData.append("formJson", JSON.stringify(this.formToBeSend));
        this.http.updateLeadForm(this.formData, this.modalData._id).subscribe(res => {
          console.log(res);
          this.onClose.next(true);
          this.http.updateSmartFormList();
        });
        this.http.hideModal();
        // if(this.update){
        //     this.obj.name = this.formInfo.value.formName;
        //     this.obj.description = this.formInfo.value.formDescription;
        //     this.obj.formJson = this.formToBeSend;
        //     this.obj.status = "PUBLISHED";
        //     console.log(this.obj);
        //     this.http.updateSmartForm(this.obj, this.modalData._id).subscribe(res => {
        //         console.log(res);
        //         this.onClose.next(true);
        //         this.http.updateSmartFormList();
        //     });
        //     this.published = true;
        //     this.update = false;
        // }
        // // console.log(this.formInfo.value.formName);
        // else{
        //     if(!this.formInfo.value.formDescription){
        //         this.formInfo.value.formDescription = "---";
        //     }
        //     this.obj.name = this.formInfo.value.formName;
        //     this.obj.description = this.formInfo.value.formDescription;
        //     this.obj.formJson = this.formToBeSend;
        //     this.obj.status = "PUBLISHED";
        //     console.log(this.obj);
        //     // this.objTest.resultJson = this.formToBeSend;
        //     // console.log(this.objTest);
        //     // const obj = {
        //     //     "name":"Smartform1",
        //     //     "description":"Test Description",
        //     //     "formJson": {components :{
        
        //     //     }}
        //     // }
        //     this.http.submitSmartForm(this.obj).subscribe(res => {
        //         console.log(res);
        //         this.onClose.next(true);
        //         this.http.updateSmartFormList();
        //     });
        //     this.published = true;
        // }
      }
  
  
      updateForm(data){
          console.log(data);
          if(data.name || data.description){
            this.formToBeSend = this.form = data.formJson;
            this.tempForm = data.formJson;
            const { businessName, description } = data;
              this.formInfo.patchValue({
                  formName: businessName, 
                  formDescription: description
              });
          }
          else{
            this.formToBeSend = this.form = data.formJson;
            this.tempForm = data.formJson;
            this.formInfo.patchValue({
              formName: "Untitled Form", 
              formDescription: "---"
            });
          }
        // console.log(this.formInfo);
        this.update = true;
      }
    
      onChange(event: FormBuilderChangeEvent) {
        console.log(event);
        // console.log(myForm);
        if(event.type == "deleteComponent")
        {
          if(this.isDefaultComponent(event.component)){
            console.log("default deleted");
            event.form.components.splice(event.index,0, event.component);
            this.http.openSnackBar("You Cannot Delete Default Form Fields !!", "OK");
            this.leadFormbuilder.rebuildForm(event.form);
            this.formToBeSend = event.form;
        }else {
            console.log("extra deleted");
            this.leadFormbuilder.rebuildForm(event.form);
            this.formToBeSend = event.form;
        }
        } else if(event.type == "addComponent"){
            this.leadFormbuilder.rebuildForm(event.form);
            this.formToBeSend = event.form;
        } else {
            console.log("----");
        }
      }

      private isDefaultComponent(component: ExtendedComponentSchema) {
        let defaultForm = this.getDefaultForm()
        return defaultForm.components.find(x => x.key == component.key) ? true : false;
      }


 
      onDraft(){
        // if(this.update){
        //     if(!this.published){
        //         this.obj.name = this.formInfo.value.formName;
        //         this.obj.description = this.formInfo.value.formDescription;
        //         this.obj.formJson = this.formToBeSend;
        //         this.obj.status = "DRAFT";
        //         console.log(this.obj);
        //         this.http.updateSmartForm(this.obj, this.modalData._id).subscribe(res => {
        //             this.onClose.next(true);
        //             this.http.updateSmartFormList();
        //         });
        //     }
        //     this.update = false;
        // }
        // else{
        //     if(!this.published){
        //         if(!this.formInfo.value.formName && !this.formInfo.value.formDescription){
        //             this.obj.name = "Untitled Form";
        //             this.obj.description = "---";
        //         }
        //         else if(!this.formInfo.value.formName){
        //             this.obj.name = "Untitled Form";
        //             this.obj.description = this.formInfo.value.formDescription;
        //         }
        //         else if(!this.formInfo.value.formDescription){
        //             this.obj.name = this.formInfo.value.formName;
        //             this.obj.description = "---";
        //         }
        //         else{
        //             this.obj.name = this.formInfo.value.formName;
        //             this.obj.description = this.formInfo.value.formDescription;
        //         }
        //         this.obj.formJson = this.formToBeSend;
        //         this.obj.status = "DRAFT";
        //         console.log(this.obj);
        //         this.http.postSmartForm(this.obj).subscribe(res => {
        //             console.log(res);
        //             this.onClose.next(true);
        //             this.http.updateSmartFormList();
        //         });
        //     }}
      }
      private getDefaultForm() {
        return {
          "components": [
          {
              "label": "First Name",
              "tableView": true,
              "validate": {
                  "required": true,
                  "maxLength": 40
              },
              "key": "firstName",
              "type": "textfield",
              "input": true
          },
          {
              "label": "Last Name",
              "tableView": true,
              "validate": {
                  "required": true,
                  "maxLength": 40
              },
              "key": "lastName",
              "type": "textfield",
              "input": true
          },
          {
              "label": "Email Address",
              "tableView": true,
              "validate": {
                  "required": true
              },
              "key": "email",
              "type": "textfield",
              "input": true
          },
          {
              "label": "Phone",
              "placeholder": "Phone",
              "tableView": true,
              "validate": {
                  "required": true
              },
              "key": "phone",
              "type": "phoneNumber",
              "input": true
          },
          {
              "label": "Phone Type",
              "widget": "choicesjs",
              "tableView": true,
              "defaultValue": "office",
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
              "selectThreshold": 0.3,
              "key": "phoneType",
              "type": "select",
              "indexeddb": {
                  "filter": {}
              },
              "input": true
          },
          {
              "label": "Add Note",
              "autoExpand": false,
              "tableView": true,
              "key": "addNote",
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
        }
      }
}
