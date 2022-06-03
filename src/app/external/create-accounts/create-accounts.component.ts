import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, map, tap } from 'rxjs/operators';
import { ApiUrl } from 'src/app/services/apiUrls';

@Component({
  selector: 'app-create-accounts',
  templateUrl: './create-accounts.component.html',
  styleUrls: ['./create-accounts.component.css']
})
export class CreateAccountsComponent implements OnInit {

  public form: FormGroup; 
  public loader = false;
  public terms = new FormControl(null);
  messageList: any;
  businessCategories: {key: string, value: number}[] = [];

  get f() : {  
    [key: string]: AbstractControl;
  }{ return this.form.controls; } 

  constructor(private http: HttpService) { 
    this.form = this.http.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.http.CONSTANT.EMAIL_REGEX)])],
      countryCode: ['+91', Validators.required],
      phoneNumber: ['', Validators.required],
      businessName: ['', Validators.required],
      businessSize: ['', Validators.required],
      businessCategory: ['', Validators.required],
      notes: [''],
  });
  }

  ngOnInit() {
    this.businessTypesList();
    this.getCustomValidationMessage();
  }
  getCustomValidationMessage() {
    this.messageList = {
      phoneNumber: {
        pattern: "Please enter valid phone number",
      },
      email: {
        pattern:"Please enter valid email" ,
      },
    };
  }


  finalSubmit() {
    if (!this.terms.value) {
      this.http.handleError("Please accepts terms and condition");
      return;
    }
    if (this.form.invalid) {
      console.log(this.form);
      this.http.markFormGroupTouched(this.form);
      let arr = this.http.findInvalidControlsRecursive(this.form);
      console.log(arr)
      return;
  }
    if (this.http.isFormValid(this.form)) {
        let formValues = {};
        // for (let _o in this.form.controls) {
        //     if (_o !== "imageUrl") {
        //         formValues[_o] = this.form.controls[_o].value.trim();
        //     }
        // }
        this.form.patchValue(formValues);
        const obj: any = JSON.parse(JSON.stringify(this.form.value));
        this.loader = true;
        this.http.postData(ApiUrl.REGISTER, obj).pipe(finalize(()=>{this.loader = false;})).subscribe(res => {
            this.http.openSnackBar('Registerd Successfully');
            this.http.navigate("thankspage");
            // this.http.setLoginData(res.data);
        });
    }
  }

  businessTypesList() {
    this.http.getData(ApiUrl.BUSINESS_LIST_TYPE, {})
    .pipe(
      map(x => x.data),
      tap((res) => { this.businessCategories = res})
    )
    .subscribe(res => {
      console.log("business types => ", res);
    });
  }

  get businessCategory() {
    let val = this.form.controls['businessCategory'].value;
    return val ? this.businessCategories.filter(x => x.value == val)[0].key : '';
  }
}
