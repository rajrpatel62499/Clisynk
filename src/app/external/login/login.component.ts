import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {ApiUrl} from '../../services/apiUrls';
import {ForgotPasswordComponent} from '../../shared/modals/forgot-password/forgot-password.component';
import {AclService} from '../../services/acl.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public form: FormGroup; 
    public loader = false;
    rememberMeControl = new FormControl(false);
    showPassword : boolean = true;

    constructor(public http: HttpService, public acl: AclService) {
        this.form = this.http.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern(this.http.CONSTANT.EMAIL_REGEX)])],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        if (localStorage.getItem('rememberMe')) {
            this.rememberMeControl.patchValue(true);
            this.form.patchValue(JSON.parse(localStorage.getItem('rememberData')));
        }
    }

    openForgotPassword() {
        this.http.showModal(ForgotPasswordComponent);
    }

    loginFun() {
        if (this.http.isFormValid(this.form)) {
            this.loader = true;
            this.http.postData(ApiUrl.LOGIN, this.form.value, false).subscribe(res => {
                        if (this.rememberMeControl.value) {
                            localStorage.setItem('rememberMe', this.rememberMeControl.value);
                            localStorage.setItem('rememberData', JSON.stringify(this.form.value));
                        } else {
                            localStorage.removeItem('rememberMe');
                            localStorage.removeItem('rememberData');
                        }
                        localStorage.setItem('accessToken', res.data.accessToken);
                        // localStorage.setItem('loginData', JSON.stringify(res.data));
                        this.http.setLoginData(res.data);
                        this.http.updateDeviceToken();
                        this.http.navigate('home');

                        // this.acl.goToFirst();
                        // this.http.navigate(res.data.roles[0]);

                    },
                    () => {
                        this.loader = false;
                    });
        }
    }

}


