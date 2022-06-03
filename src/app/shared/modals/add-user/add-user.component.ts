import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import {DeleteComponent} from '../delete/delete.component';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html'
})
export class AddUserComponent implements OnInit {

    form: FormGroup;
    myModel: any;
    modalData: any;
    public onClose: Subject<boolean>;
    isEdit = false;
    dropdownSettings: any = {
        idField: 'path',
        textField: 'title',
        itemsShowLimit: 5,
        allowSearchFilter: true,
        'disabled': true
    };
    sideBar = this.http.CONSTANT.sideBarAdmin;
    moreUrl: any = ['/contacts/manage-tag', '/settings', '/settings/my-profile', '/booking', '/contacts/tag-settings',
        '/booking', '/receipt'];

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        if (this.modalData) {
            this.isEdit = true;
            this.fillValues();
        }
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            const obj: any = JSON.parse(JSON.stringify(this.form.value));
            if (this.form.value.roles.length) {
                let arr: any = [];
                this.form.value.roles.forEach((val) => {
                    arr.push(val.path);
                });
                if (arr.includes('/money')) {
                    arr.push('/settings/products');
                }
                obj.roles = JSON.stringify(arr.concat(this.moreUrl));
            }
            this.http.hideModal();
            this.http.postData(ApiUrl.ADD_USER, obj).subscribe((res) => {
                console.log('add sub admin res.........',res)
                localStorage.setItem('adminRef', res.data._id)
                let msg = 'Added Successfully';
                if (this.modalData && this.modalData.email) {
                    msg = 'Updated Successfully';
                }
                this.http.openSnackBar(msg);
                this.onClose.next(true);
            }, () => {
            });
        }
    }

    formInit() {
        this.form = this.http.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.pattern(this.http.CONSTANT.EMAIL_REGEX)])],
            phone1: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
            roles: ['', Validators.required],
            userId: ['']
        });
    }

    fillValues() {
        const roles: any = [];
        this.sideBar.forEach((val) => {
            this.modalData.roles.forEach((val1) => {
                if (val.path === val1) {
                    roles.push(val);
                }
            });
        });
        this.form.patchValue({
            firstName: this.modalData.firstName,
            lastName: this.modalData.lastName,
            email: this.modalData.email,
            phone1: this.modalData.phone1,
            userId: this.modalData._id,
            roles: roles
        });
    }

    // deleteFun() {
    //     const obj: any = {
    //         type: 11,
    //         key: 'id',
    //         message: 'Are you sure you want to delete this user?',
    //         id: this.modalData._id
    //     };
    //     const modalRef = this.http.showModal(DeleteComponent, 'sm', obj);
    //     modalRef.content.onClose = new Subject<boolean>();
    //     modalRef.content.onClose.subscribe(() => {
    //         this.http.hideModal();
    //         this.http.openSnackBar('Deleted Successfully');
    //         this.onClose.next(true);
    //     });
    // }

}
