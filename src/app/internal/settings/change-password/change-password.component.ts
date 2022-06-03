import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { TableModel } from '../../../shared/models/table.common.model';
import { ApiUrl } from '../../../services/apiUrls';

@Component({
    selector: 'app-change-password',
    styleUrls: ['./change-password.component.scss'],
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    hideCurrent: boolean = true;
    hideConfirm: boolean = true;
    isLoading = false;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
    }

    formInit() {
        this.form = this.http.fb.group({
            password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
            confirmPassword: ['', Validators.required],
            currentPassword: ['', Validators.required]
        });
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            if (this.form.value.currentPassword === this.form.value.password) {
                this.http.toastr.error('New password and old password can\'t be same');
                return;
            }
            if (this.form.value.password !== this.form.value.confirmPassword) {
                this.http.toastr.error('New password and confirm password must be same');
                return;
            }
            const obj: any = {
                oldPassword: this.form.value.currentPassword,
                newPassword: this.form.value.confirmPassword
            };
            this.isLoading = true;
            this.http.postData(ApiUrl.CHANGE_PASSWORD, obj).pipe(finalize(() => { this.isLoading = false; })).subscribe(res => {
                if (res.statuscode === 400) {
                    this.http.toastr.error(res.msg);
                } else {
                    this.http.openSnackBar('Password Changed Successfully');
                }
                this.form.reset();
            }
            );
        }
    }
}
