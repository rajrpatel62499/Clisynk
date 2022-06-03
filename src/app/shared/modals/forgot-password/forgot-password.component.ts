import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormGroup, Validators} from '@angular/forms';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html'
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

    forgotPasswordFun() {
        if (this.http.isFormValid(this.form)) {
            this.loader = true;
            this.http.postData(ApiUrl.FORGOT_PASSWORD, this.form.value).subscribe(() => {
                        this.loader = false;
                        this.http.openSnackBar('Submitted Successfully');
                        this.http.hideModal();
                    },
                    () => {
                        this.loader = false;
                        this.http.hideModal();
                    });
        }
    }

}
