import {Component, OnInit} from '@angular/core';
import {TableModel} from '../../models/table.common.model';
import {HttpService} from '../../../services/http.service';
import {FILTERS} from './contact-filter.constant';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-contact-filter',
    templateUrl: './contact-filter.component.html'
})
export class ContactFilterComponent implements OnInit {

    form: FormGroup;
    allData: any;
    modalData: any;
    isEdit = false;
    contacts = [];
    removeContacts = [];
    tags: any = [];
    loader = false;
    settingsContactsTags = {
        singleSelection: false,
        idField: '_id',
        textField: 'name',
        enableCheckAll: true,
        selectAllText: 'Select all',
        unSelectAllText: 'Search Contact',
        allowSearchFilter: true,
        limitSelection: -1,
        clearSearchFilter: true,
        itemsShowLimit: 4,
        searchPlaceholderText: 'Search',
        closeDropDownOnSelection: false,
        showSelectedItemsAtTop: false,
        defaultOpen: false
    };
    settingsContacts = {
        singleSelection: false,
        idField: '_id',
        textField: 'email',
        enableCheckAll: true,
        selectAllText: 'Select all',
        unSelectAllText: 'Search Contact',
        allowSearchFilter: true,
        limitSelection: -1,
        clearSearchFilter: true,
        itemsShowLimit: 4,
        searchPlaceholderText: 'Search',
        closeDropDownOnSelection: false,
        showSelectedItemsAtTop: false,
        defaultOpen: false
    };
    onClose: Subject<boolean>;

    constructor(public http: HttpService, public route: Router) {}

    ngOnInit(): void {
        if (this.modalData) {
            this.isEdit = true;
            console.log('this.modalData:::', this.modalData);
            this.updateFormInit(this.modalData);
        } else {
            this.formInit();
        }
        this.contactList();
        this.contactTagList();
    }

    formInit() {
        this.form = this.http.fb.group({
            name: ['', Validators.compose([Validators.pattern("[a-zA-Z0-9_ ]*"), Validators.required])],
            contactIds: ['', Validators.required],
            tagIds: ['']
        });
    }

    updateFormInit(modalData?) {
        this.form = this.http.fb.group({
            name: [modalData.name, Validators.compose([Validators.pattern("[a-zA-Z0-9_ ]*"), Validators.required])],
            contactIds: [modalData.contacts],
            tagIds: [modalData.tagIds]
        });
    }

    resetBtn() {
        this.form.reset();
    }

    contactList() {
        const obj: any = {
            skip: 0,
            limit: 1000,
            search: ''
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
            this.contacts = res.data.data;
            
        });
    }

    contactTagList(){
        this.http.getData(ApiUrl.TAGS).subscribe(res => {
            this.tags = res.data.data;
        },() => {});
    }

    finalSubmit() {
        const updateObj: any = {};
        const obj: any = JSON.parse(JSON.stringify(this.form.value));
        obj.contactIds = obj.contactIds ? obj.contactIds.map(item => {return item._id}) : [];
        obj.tagIds = obj.tagIds ? obj.tagIds.map(item => {return item._id}) : [];
        if(this.http.isFormValid(this.form)){
            this.loader = true;
            updateObj.name = obj.name;
            updateObj.contactListId = this.modalData ? this.modalData.id : "";
            updateObj.contactIds = obj.contactIds;
            updateObj.op = "add";
            if(this.modalData && this.modalData.id){
                this.http.postCreateGroup(this.isEdit ? ApiUrl.UPDATE_CONTACT_GROUP : ApiUrl.CREATE_CONTACT_GROUP, this.isEdit ? updateObj : obj).subscribe(() => {
                    this.loader = false;
                    this.isEdit ? this.http.openSnackBar('Contact group updated Successfully') : this.http.openSnackBar('Contact group added Successfully');
                    this.http.hideModal();
                    this.http.navigate('contacts');
                    this.http.eventSubject.next({eventType: 'addContact'});
                }, () => {
                    this.loader = false;
                    this.http.hideModal();
                });
            } else {
                this.http.postCreateGroup(this.isEdit ? ApiUrl.UPDATE_CONTACT_GROUP : ApiUrl.CREATE_CONTACT_GROUP, this.isEdit ? updateObj : obj).subscribe(() => {
                    this.loader = false;
                    this.isEdit ? this.http.openSnackBar('Contact group updated Successfully') : this.http.openSnackBar('Contact group added Successfully');
                    this.http.hideModal();
                    this.http.navigate('contacts');
                    this.http.eventSubject.next({eventType: 'addContact'});
                }, () => {
                    this.loader = false;
                    this.http.hideModal();
                });
            }
            if(this.modalData && this.modalData.id && this.removeContacts.length > 0){
                this.removeContacts = this.removeContacts ? this.removeContacts.map(item => {return item._id}) : [];
                updateObj.contactListId = this.modalData.id;
                updateObj.contactIds = this.removeContacts;
                updateObj.op = "remove";
                this.http.postCreateGroup(this.isEdit ? ApiUrl.UPDATE_CONTACT_GROUP : ApiUrl.CREATE_CONTACT_GROUP, this.isEdit ? updateObj : obj).subscribe(() => {
                    this.loader = false;
                    this.http.navigate('contacts');
                    this.http.eventSubject.next({eventType: 'addContact'});
                }, () => {
                    this.loader = false;
                });
            }
        }
    }

    public onItemSelect(item: any) {}

    public onDeSelect(item: any) {
        if(this.modalData){
            this.removeContacts.push(item);
        }
    }

    public onSelectAll(items: any) {

    }

    public onDeSelectAll(items: any) {
        if(this.modalData){
            this.removeContacts = items;
        }
    }

    public onItemSelectTag(item: any) {}

    public onDeSelectTag(item: any) {}

    public onSelectAllTag(items: any) {}

    public onDeSelectAllTag(items: any) {}

}
