import { MB } from './../../../services/constants';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Subject } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { LeadFormCreateComponent } from 'src/app/shared/modals/lead-form-create/lead-form-create.component';

@Component({
  selector: 'app-lead-forms',
  templateUrl: './lead-forms.component.html',
  styleUrls: ['./lead-forms.component.css']
})
export class LeadFormsComponent implements OnInit {

  leadForm:FormGroup = this.fb.group({
    businessName:[null, [Validators.required]],
    logo:['', [ 
        RxwebValidators.image({ maxHeight: 300,maxWidth: 300 }),
        RxwebValidators.extension({ extensions: ["jpeg","png","tiff"] })
        ]       
    ],
  })


  formData: FormData = new FormData(); 

  logoUrl: any;
  loader: any;
  file: any = null;
  oldFile: any = null;
  copied = false;
  inputTouched = false;

  async getLeadForm(){
    this.loader = true;
    let gotForm = false;
    const res = await this.http.getLeadForm().toPromise();
    console.log(res);
    if(res.data.length > 0 && Array.isArray(res.data[0].formJson.components) && res.data[0].formJson.components.length){
        let temp = true;
        for (let i in res.data){
            if((res.data[i].addedBy._id == JSON.parse(localStorage.getItem('loginData'))._id) && temp){
                this.editForm = res.data[i] 
                this.form = res.data[i].formJson;
                this.leadForm.patchValue({
                    businessName: res.data[i].businessName
                });
                // this.oldFile = this.file = this.logoUrl = res.data[i].businessLogo; // one is to display one is to store one is to compare
                if(res.data[i].businessLogo) {
                   this.logoUrl = this.oldFile = this.file = res.data[i].businessLogo; 
                }
                console.log(res.data[i]);
                temp = false;
                gotForm = true;
                this.loader = false;
            }
        }
    }
    else {
        this.formData.append("name", "Smartform1");
        this.formData.append("description", "Test Description");
        this.formData.append("formJson", JSON.stringify({
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
                    "required": true,
                },
                "key": "email",
                "kickbox": {
                    "enabled": true
                },
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
        }));
        this.formData.append("tags", JSON.stringify(["lead"]));
        this.http.postSmartForm(this.formData).subscribe(res =>{
            console.log(res);
            this.editForm = res["data"];
            this.form = res["data"].formJson;
            this.loader = false;
        }, () => {
            this.loader = false;
        })
    }
  }

  onPreview(){
    this.leadForm.value.businessName ? this.formData.set("businessName", String(this.leadForm.value.businessName))
                                     : this.formData.set("businessName", "");
    
    this.file ? this.formData.set("businessLogo", this.file) : this.formData.set("businessLogo", "");
    this.oldFile == this.file ? this.formData.delete("businessLogo") : "";
    
    this.http.updateLeadForm(this.formData, this.editForm._id).subscribe(res => {
        console.log(res);
    });
    if(!this.copied){
        this.router.navigate([]).then(result => {  window.open("/preview-leadform/" + this.editForm._id, '_blank'); });
    }
    this.copied = false;
  }


  public editForm: any;

  public form: Object = {};

  onEdit(data?) {
    console.log(this.editForm);
    if(this.inputTouched){
        this.editForm.businessName = this.leadForm.value.businessName;
        this.inputTouched = false;
    }
    const modalRef = this.http.showModal(LeadFormCreateComponent, 'custom-class-for-create-smart-form', this.editForm,);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() =>{
        this.getLeadForm();
    })
  }

  constructor(private fb: FormBuilder, public http: HttpService, public router: Router) { }

  ngOnInit() {
    this.getLeadForm();
    this.formData.append("businessName", "");
    this.formData.append("businessLogo", "");
    this.formData.append("status", "PUBLISHED");
  }

  onSubmit(){
    console.log(this.leadForm);
  }

  onImageChanged(event) {
        console.log(event.target.files);
        
        this.file = <File>event.target.files[0];
        if (!this.http.isValidateFileTypeAndSize(this.file,'image', 5 * MB)) return;
        if (event.target.files === 0){
            return;
        }
        else{
            const reader = new FileReader();
            console.log(this.file);
            reader.readAsDataURL(this.file); 
            reader.onload = (_event) => { 
                this.logoUrl = reader.result;
                this.editForm.businessLogo = this.logoUrl;
                this.http.updateLeadForm(this.formData, this.editForm._id).subscribe(res => {
                    this.logoUrl = res.data.businessLogo;
                });
            }
            this.formData.set("businessLogo", this.file);
        }
    }
    
    onInputChange(event){
        this.inputTouched = true;
        this.formData.set("businessName", this.leadForm.get("businessName").value);
        this.http.updateLeadForm(this.formData, this.editForm._id)
        .subscribe(res => {
            this.logoUrl = res.data.businessLogo;
            this.leadForm.value.businessName = res.data.businessName;
        });
    }

    copyLink(){
        this.copied = true;
        this.onPreview();
        const copy = document.createElement('textarea');
        copy.style.position = 'fixed';
        copy.style.left = '0';
        copy.style.top = '0';
        copy.style.opacity = '0';        
        copy.value = window.location.origin + "/preview-leadform/" + this.editForm._id;
        document.body.appendChild(copy);
        copy.focus();
        copy.select();
        document.execCommand('copy');
        document.body.removeChild(copy);
        this.http.openSnackBar('Form link copied successfully');
    }

    copyCode(){
        const copy = document.createElement('textarea');
        copy.style.position = 'fixed';
        copy.style.left = '0';
        copy.style.top = '0';
        copy.style.opacity = '0';
        copy.value = JSON.stringify(this.editForm, null, 2);
        document.body.appendChild(copy);
        copy.focus();
        copy.select();
        document.execCommand('copy');
        document.body.removeChild(copy);
        this.http.openSnackBar('Code copied successfully');
    }

    removeLogo(){
        this.logoUrl = null;
        this.leadForm.controls['logo'].setValue(null);
        this.file = null;
        this.formData.set("businessLogo", "");
        this.http.updateLeadForm(this.formData, this.editForm._id).subscribe(res => {
            console.log(res);
            this.logoUrl = res.data.businessLogo;
        });
    }
  
}
