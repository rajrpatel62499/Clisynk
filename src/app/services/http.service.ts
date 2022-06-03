import { EventEmitter, Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as constant from './constants';
import { ToastrService } from 'ngx-toastr';
import { Lightbox } from 'ngx-lightbox';
import { BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DOCUMENT, Location } from '@angular/common';
import { ExportToExcelService } from './exportToExcel.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { ApiUrl } from './apiUrls';
import { Automation } from '../internal/automations/models/automation';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    public filesData: any = [];
    modalRefArr: any = [];
    CONSTANT = constant;
    modalRef: BsModalRef;
    public readonly apiEndpoint: String;

    private loaderSubject = new BehaviorSubject<any>(null);
    public loaderStatus = this.loaderSubject.asObservable();

    private contactUpdatedSubject = new BehaviorSubject<any>(null);
    public contactUpdatedStatus = this.contactUpdatedSubject.asObservable();

    private contactUpdatedSubjectChat = new BehaviorSubject<any>(null);
    public contactUpdatedStatusChat = this.contactUpdatedSubjectChat.asObservable();

    public eventSubject = new BehaviorSubject<any>(null);
    public eventStatus = this.eventSubject.asObservable();

    private modalSubject = new BehaviorSubject<any>(null);
    public modalStatus = this.modalSubject.asObservable();

    private searchSubject = new BehaviorSubject<any>(null);
    public searchStatus = this.searchSubject.asObservable();

    private updateSFListSubject = new BehaviorSubject<any>(null);
    public SFReload = this.updateSFListSubject.asObservable();

    private workspaceListSubject = new BehaviorSubject<any>(null);
    public workspaceList = this.workspaceListSubject.asObservable();

    private workspaceSubject = new BehaviorSubject<any>(null);
    public workspace = this.workspaceSubject.asObservable();

    private workspaceManipulateSubject = new BehaviorSubject<any>(null);
    public work = this.workspaceManipulateSubject.asObservable();

    private workspaceDeleteSubject = new BehaviorSubject<any>(null);
    public deleteWork = this.workspaceDeleteSubject.asObservable();

    private documentUpdatedSubject = new BehaviorSubject<any>(null);
    public documentUpdatedStatus = this.documentUpdatedSubject.asObservable();

    private automationsSubject = new BehaviorSubject<Automation[]>(null);
    public automationsStatus$ = this.automationsSubject.asObservable();


    public heading: string;
    domain: string;
    loginData: any;
    myLoader = false;

    test: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private router: Router, public http: HttpClient, public toastr: ToastrService,
        public lightBox: Lightbox, public modalService: BsModalService, public fb: FormBuilder,
        @Inject(DOCUMENT) public document: any, private location: Location,
        public _snackBar: MatSnackBar, public exportService: ExportToExcelService
    ) {
        this.apiEndpoint = environment.apiBaseUrl;
        this.domain = this.document.location.origin;
        this.loginData = JSON.parse(localStorage.getItem('loginData'));
    }

    goBack() {
        this.location.back();
    }

    setLoginData(data) {
        this.loginData = data;
        localStorage.setItem('loginData', JSON.stringify(data));
    }

    getLoginData() {
        return JSON.parse(localStorage.getItem('loginData'));
    }

    openSnackBar(message: string, action?: string) {
        this._snackBar.open(message, action, {
            duration: 3000,
            horizontalPosition: 'right',
            panelClass: 'custom-snack'
        });
    }

    updateEvent(eventType, data?) {
        const obj: any = {
            eventType: eventType
        };
        if (data) {
            obj.data = data;
        }
        this.eventSubject.next(obj);
    }
    updateDocument(url, obj, isLoading?: boolean) {
        const formData = new FormData();
        Object.keys(obj).forEach(key => {
            if (obj[key] !== '' && obj[key] !== undefined) {
                formData.append(key, obj[key]);
            }
        });
        return this.http.post<any>(this.apiEndpoint + url, obj, { reportProgress: isLoading });
    }

    documentUpdated(data?) {
        this.documentUpdatedSubject.next(data ? data : false);
    }
    sendSearch(data) {
        this.searchSubject.next(data);
    }

    contactUpdated(data?) {
        this.contactUpdatedSubject.next(data ? data : false);
    }

    contactUpdatedChat(data?) {
        this.contactUpdatedSubjectChat.next(data ? data : false);
    }

    updateSmartFormList(data?) {
        this.updateSFListSubject.next(data ? data : false);
    }

    // Automations 
    updateAutomationsList(data: Automation[]) {
        this.automationsSubject.next(data);
    }

    openModal(name, data?) {
        const obj: any = {
            name: name,
            data: data
        };
        this.modalSubject.next(obj);
    }

    openInvoice(name, data?): void {
        const money = document.getElementById('money_container');
        money ? money.style.display = 'none' : '';
        const obj: any = {
            name: name,
            data: data
        };
        this.modalSubject.next(obj);
    }

    fileDownloadFromServer(file) {
        const link = document.createElement('a');
        link.download = 'filename';
        link.href = this.apiEndpoint + 'files/' + file + '.xlsx';
        link.click();
    }

    fileDownloadFromLink(url) {
        const link = document.createElement('a');
        link.download = 'filename';
        link.href = url;
        link.click();
    }

    goToLink(url: string) {
        window.open(url, '_blank');
    }

    loaderOn(loaderStatus) {
        this.myLoader = loaderStatus;
        this.loaderSubject.next(loaderStatus);
    }

    isFormValid(form) {
        if (form.valid) {
            return true;
        } else {
            Object.keys(form.controls).forEach(key => {
                form.controls[key].markAsTouched({ onlySelf: true });
            });
        }
    }

    sweetConfirm(msg) {
        let flag = false;
        return Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want te delete this ' + msg,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        })
        // .then((result) => {
        //     // return !!result.value;
        //     flag = true;
        // });
        // return flag;
    }

    navigate(url, params?) {
        if (params) {
            this.router.navigate([`/${url}`, params]);
        } else {
            this.router.navigate([`/${url}`]);
        }
    }

    changeTitle(title) {
        this.heading = title;
    }

    getData(url, obj?, isLoading?: boolean) {
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(this.apiEndpoint + url, { params: params, reportProgress: isLoading });
    }

    getDataNew(url, obj?, isLoading?: boolean) {
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(url, { params: params, reportProgress: isLoading });
    }

    postData(url, obj, isLoading?: boolean) {
        const formData = new FormData();
        Object.keys(obj).forEach(key => {
            if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
                formData.append(key, obj[key]);
            }
        });
        return this.http.post<any>(this.apiEndpoint + url, formData, { reportProgress: isLoading });
    }

    postDataNew(url, obj, isLoading?: boolean) {
        const formData = new FormData();
        Object.keys(obj).forEach(key => {
            if (obj[key] !== undefined && obj[key] !== null) {
                formData.append(key, obj[key]);
            }
        });
        return this.http.post<any>(this.apiEndpoint + url, formData, { reportProgress: isLoading });
    }

    postChatImage(url, payload, isLoading?: boolean) {

        return this.http.post<any>(this.apiEndpoint + url, payload, { reportProgress: isLoading });
    }

    downloadLink(url) {
        window.location.href = url;
    }

    openLightBox(data) {
        if (data) {
            const temp: any = [];
            temp.push({
                src: data,
                thumb: data
            });
            const options = {
                positionFromTop: 60
            };
            this.lightBox.open(temp, 0, options);
            return true;
        }
    }

    uploadImage(url, file, isLoading?) {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post<any>(this.apiEndpoint + url, formData, { reportProgress: isLoading });
    }

    uploadMultipleImages(url:string, files: File[], isLoading) {
        const formData = new FormData();
        files.forEach((file,index) => formData.append(`image`, file));
        return this.http.post<any>(this.apiEndpoint + url, formData, { reportProgress: isLoading });
    }

    uploadFile(url, file, isLoading?: boolean) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(this.apiEndpoint + url, formData, { reportProgress: isLoading });
    }

    checkImage(file) {
        if (file) {
            if (file.size < 1000000) {
                if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
                    return true;
                } else {
                    this.openSnackBar('Please add jpg or png image only');
                }
            } else {
                this.openSnackBar('Please add image less than 10 MB');
            }
        }
        return false;
    }

    showModal(template, size?, data?) {
        const initialState: any = {};
        if (data) {
            initialState.modalData = data;
        }
        const modalRef = this.modalService.show(template,
            {
                initialState, keyboard: true, class: `gray modal-${size ? size : 'md'}`
                // initialState, keyboard: true, class: `gray modal-${size ? size : 'md'}`, backdrop: 'static'
            }
        );
        if (!this.modalRefArr.includes(modalRef.content)) {
            this.modalRefArr.push(modalRef);
        }
        return modalRef;
    }

    hideModal() {
        const element = this.modalRefArr.pop();
        if (element) {
            element.hide();
        } else {
            this.modalRefArr.hide();
        }
    }

    closeAllModals() {
        this.modalRefArr.forEach(modal => modal.hide());
        this.modalRefArr.length = 0;
    }

    printExcel(res, fileName, flag) {
        const arr: any = [];
        let tempArr: any;
        if (flag === 1) {
            tempArr = res.doctorlist;
        } else {
            tempArr = res.userlist;
        }

        tempArr.forEach((val, key) => {
            arr.push({
                'S.No': key + 1,
                'Name': val.first_name + ' ' + val.last_name,
                'email': val.email || 'N.A.',
                'Contact No': val.country_code + ' ' + val.phone_number || 'N.A.',
                'Date of Birth': val.date_of_birth || 'N.A.',
                'Gender': val.gender || 'N.A.',
                'Country': val.country || 'N.A.',
                'State': val.state || 'N.A.',
                'City': val.city || 'N.A.',
                'Status': val.status || 'N.A.'
            });
        });
        this.exportService.exportAsExcelFile(arr, fileName);
    }

    changeDate(val) {
        const date = new Date();
        const splitDate = val.split('-');
        date.setFullYear(parseInt(splitDate[2], 10));
        date.setMonth(parseInt(splitDate[1], 10) - 1);
        date.setDate(parseInt(splitDate[0], 10));
        return date;
    }

    addQueryParams(obj) {
        this.router.navigate([], { queryParams: obj });
    }

    getIsSelected(arr, key) {
        const temp: any = [];
        arr.forEach((val) => {
            if (val[key]) {
                temp.push(val._id);
            }
        });
        return temp;
    }

    getIdsOnly(arr) {
        if (arr) {
            const temp: any = [];
            arr.forEach((val) => {
                temp.push(val._id);
            });
            return temp;
        } else {
            return [];
        }
    }
    getEmailsOnly(arr) {
        if (arr) {
            const temp: any = [];
            arr.forEach((val) => {
                temp.push(val.email);
            });
            return temp;
        } else {
            return [];
        }
    }

    formatBytes(bytes, decimals, binaryUnits?) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const unitMultiple = (binaryUnits) ? 1024 : 1000;
        const unitNames = (unitMultiple === 1024) ? // 1000 bytes in 1 Kilobyte (KB) or 1024 bytes for the binary version (KiB)
            ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'] :
            ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));
        return parseFloat((bytes / Math.pow(unitMultiple, unitChanges)).toFixed(decimals || 0)) + ' ' + unitNames[unitChanges];
    }

    checkLastName(val) {
        if (val.lastName) {
            val.showName = val.firstName + ' ' + val.lastName;
        } else {
            val.showName = val.firstName + ' ';
        }
    }

    handleError(msg: string) {
        this.showToaster(msg, 'error');
    }
    saveData(data) {
        localStorage.setItem('savedData', JSON.stringify(data));
    }

    getSavedData() {
        return JSON.parse(localStorage.getItem('savedData'));
    }

    clearSavedData() {
        localStorage.removeItem('savedData');
    }

    selectedInArray(allValues, selected) {
        const tempArr: any = [];
        allValues.forEach((val) => {
            selected.forEach((val1) => {
                if (val._id === val1._id) {
                    tempArr.push(val);
                }
            });
        });
        return tempArr;
    }

    findIndex(arr, id, data) {
        let index = -1;
        arr.forEach((val, key) => {
            if ((val[id] || val) === data) {
                index = key;
            }
        });
        return index;
    }

    openInNewTab(url) {
        const win = window.open(url, '_blank');
        win.focus();
    }

    checkAcl(url) {
        this.loginData = this.getLoginData();
        if (this.loginData.superAdmin) {
            return true;
        } else {
            return this.loginData.roles.includes('/' + url);
        }
    }

    updateDeviceToken() {
        if (localStorage.getItem('accessToken')) {
            const obj: any = {
                deviceToken: localStorage.getItem('deviceToken')
            };
            this.postData(ApiUrl.UPDATE_TOKEN, obj).subscribe();
        }
    }

    emptyFormArr(arr) {
        arr = (formArray: FormArray) => {
            while (formArray.length !== 0) {
                formArray.removeAt(0);
            }
        };
        return arr;
    }

    getTimeZone() {
        const d = new Date();
        return d.getTimezoneOffset();
    }

    postSmartForm(Obj) {
        return this.http.post(this.apiEndpoint + "smartForms", Obj);
    }

    postWorkspaceForm(url, Obj) {
        return this.http.post(this.apiEndpoint + url, Obj);
    }

    postWorkspaceMerge(url, Obj) {
        return this.http.post(this.apiEndpoint + url, Obj);
    }

    postWorkspaceSetActive(url, Obj) {
        return this.http.post(this.apiEndpoint + url, Obj);
    }

    postLeadForm(Obj) {
        return this.http.post(this.apiEndpoint + "smartForms/submit", Obj);
    }

    getSmartForm(isLoading?: boolean) {
        return this.http.get<any>(this.apiEndpoint + "smartForms", { reportProgress: isLoading });
    }

    deleteSmartForm(Obj) {
        return this.http.delete<any>(this.apiEndpoint + "smartForms/" + Obj);
    }

    deleteWorkspace(url) {
        return this.http.delete<any>(this.apiEndpoint + url);
    }

    deleteAutomation(url){
        return this.http.delete<any>(this.apiEndpoint + url);
    }

    updateSmartForm(Obj, id){
        return this.http.post<any>(this.apiEndpoint + "smartForms/" + id, Obj);
    }

    getLeadForm() {
        return this.http.get<any>(this.apiEndpoint + "smartForms?tag=lead");
    }

    getLeadFormById(id) {
        return this.http.get<any>(this.apiEndpoint + "smartForms/" + id);
    }

    updateLeadForm(Obj, id) {
        return this.http.post<any>(this.apiEndpoint + "smartForms/" + id, Obj);
    }

    getMailTemplates() {
        return this.http.get<any>(this.apiEndpoint + "email-templates");
    }

    getMailTemplateById(id) {
        return this.http.get<any>(this.apiEndpoint + "email-templates/search?id=" + id);
    }

    updateWorkspaceList(data?) {
        this.workspaceListSubject.next(data);
    }

    updateWorkspace(data?) {
        this.workspaceSubject.next(data);
    }
    manipulateWorkspace(payload) {
        this.workspaceManipulateSubject.next(payload);
    }
    deleteWorkspaceEvent(payload) {
        this.workspaceDeleteSubject.next(payload);
    }
    getRandomColor() {
        let color = Math.floor(0x1000000 * Math.random()).toString(16);
        return '#' + ('000000' + color).slice(-6);
    }
    postCreateGroup(apiUrl?, obj?) {
        return this.http.post<any>(this.apiEndpoint + apiUrl, obj);
    }

    postMoveFolder(apiUrl?, obj?) {
        return this.http.post<any>(this.apiEndpoint + apiUrl, obj);
    }

    postAutomation(url, obj, isLoading?: boolean) {
        // const formData = this.jsonToFormData(obj);
        return this.http.post<any>(this.apiEndpoint + url, obj, {reportProgress: isLoading});
    }

    public jsonToFormData(object) {
        const formData = new FormData();
        Object.keys(object).forEach(key => {
          if(object[key] instanceof Object ){
            if(object[key] instanceof File) {
              console.log(typeof object[key], key, object[key])
              formData.append(key,object[key]);
            }else {
              console.log(typeof object[key], key, object[key])
              formData.append(key, JSON.stringify(object[key]));
            }
          }else {
            console.log(typeof object[key], key, object[key])
            formData.append(key,object[key]);
          }
        });
        return formData;
      }
    showToaster(message: string, toastrType: string = 'success') {
    switch (toastrType) {
        case "success":
        setTimeout(() => this.toastr.success(message, "Success!"));
        break;
        case "error":
        setTimeout(() => this.toastr.error(message, "Error!"));
        break;
        case "warning":
        setTimeout(() => this.toastr.warning(message, "Warning!"));
        break;
        case "info":
        setTimeout(() => this.toastr.info(message, "Info!"));
        break;
    }
    }

    isNullOrEmpty(value) {
        if (value == undefined || value == '' || value == null) {
          return true;
        } else {
          return false;
        }
      }
      public markFormGroupTouched(formGroup: FormGroup) {
        Object.keys(formGroup.controls).map((key) => {
            formGroup.controls[key].markAsTouched();
            formGroup.controls[key].markAsDirty();
            const mayBeFG = formGroup.controls[key] as FormGroup;
            if (mayBeFG.controls) {
                this.markFormGroupTouched(mayBeFG);
            }
        });
    }
    public markFormGroupUnTouched(formGroup: FormGroup) {
        Object.keys(formGroup.controls).map((key) => {
            formGroup.controls[key].markAsUntouched();
            formGroup.controls[key].markAsPristine();
        });
        formGroup.markAsPristine();
    }

    public disableFormGroupControls(form: FormGroup) {
        for (const key in form.controls) {
          form.get(key).disable()
        }
    }

    public findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): string[] {
        var invalidControls: string[] = [];
        let recursiveFunc = (form: FormGroup | FormArray) => {
          Object.keys(form.controls).forEach(field => {
            const control = form.get(field);
            if (control.invalid) invalidControls.push(field);
            if (control instanceof FormGroup) {
              recursiveFunc(control);
            } else if (control instanceof FormArray) {
              recursiveFunc(control);
            }
          });
        }
        recursiveFunc(formToInvestigate);
        return invalidControls;
    }

    public removeFormGroupValidators(form: FormGroup) {
        for (const key in form.controls) {
          form.get(key).clearValidators();
          form.get(key).updateValueAndValidity();
        }
    }
    isValidateFileTypeAndSize(file: File, fileType: 'video' | 'image', size: number) {
        
        if (fileType == 'image') {
            if (
                file.type == constant.FileType.JPEG ||
                file.type == constant.FileType.PNG ||
                file.type == constant.FileType.JPG
              ) {
          
              } else {
                this.handleError('Please upload valid file type.!!');
                return false;
              }
        } else if (fileType == 'video') {
            if (
                file.type == constant.FileType.MP4
              ) {
          
              } else {
                this.handleError('Please upload valid file type.!!');
                return false;
              }
        }
       
        return this.isValidFileSize(file, size);
    }

    isValidFileType(file: File, allowedExt: string[]) {
        const fileExt = file.name.split(".").pop().toLowerCase();
        if(allowedExt.includes(fileExt)) {
            return true;
        } else {
            this.handleError('Please upload valid file type.!!');
            return false;
        }
    }

    isValidFileSize(file: File, size: number) {
        if (file.size >= size) {
            this.handleError(`File size should be less than ${this.formatBytes(size,0)}`);
            return false;
          }
          return true;
    }


}

