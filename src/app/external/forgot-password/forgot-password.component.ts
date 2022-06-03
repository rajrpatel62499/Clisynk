import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { ApiUrl } from 'src/app/services/apiUrls';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public form: FormGroup;
  loader = false;
  constructor(public http: HttpService) {
    this.form = this.http.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.http.CONSTANT.EMAIL_REGEX)])]
    });

   }

  ngOnInit() {
  }

  forgotFun(){
    if (this.http.isFormValid(this.form)) {
      this.loader = true;
      this.http.postData(ApiUrl.FORGOT_PASSWORD, this.form.value).subscribe(() => {
                  this.loader = false;
                  this.http.openSnackBar('New Password Send on this Email Id');
                 
              },
              () => {
                  this.loader = false;
                 
              });
    }

  }

}
