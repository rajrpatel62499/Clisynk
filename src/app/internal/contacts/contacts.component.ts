import { ContactTypes } from './../../models/enums';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {TableModel} from '../../shared/models/table.common.model';
import {FormControl, FormGroup} from '@angular/forms';
import {ApiUrl} from '../../services/apiUrls';
import {Subject, Subscription} from 'rxjs';
import {DeleteComponent} from '../../shared/modals/delete/delete.component';
import {ContactFilterComponent} from '../../shared/modals/contact-filter/contact-filter.component';
import {ActivatedRoute} from '@angular/router';
import {ContactListsComponent} from '../../shared/modals/contact-lists/contact-lists.component';
import {AddContactComponent} from '../../shared/modals/add-contact/add-contact.component';
import {ImportContactComponent} from '../../shared/modals/import-contact/import-contact.component';
import {AddRemoveTagComponent} from '../../shared/modals/add-remove-tag/add-remove-tag.component';

@Component({
    selector: 'app-contacts',
    styleUrls: ['./contacts.component.scss'],
    templateUrl: './contacts.component.html'
})

export class ContactsComponent implements OnInit, OnDestroy {

    myModel;
    search = new FormControl();
    form: FormGroup;
    subscription: Subscription;
    searchSubscription: Subscription;
    contactListSubscription: Subscription;
    loader = true;
    selectedIndex: number;
    selected: any;
    activeIcon = 1;
    loginData: any;
    selectedContactCount = 0;
    showSelected = false;
    contactsSelectedOnUpdate: any = [];
    allSelect = new FormControl();
    tab = 'allContact';
    topTitle = 'contactList';
    hiddenTabs: any;
    lists: any = [];
    contactListId: any = "";

    ContactTypes = ContactTypes;

    constructor(public http: HttpService, public activatedRoute: ActivatedRoute) {
        this.loginData = JSON.parse(localStorage.getItem('loginData'));
        this.myModel = new TableModel();
        this.myModel.activeIcon = 1;
        this.listsFun();
        activatedRoute.queryParams.subscribe(params => {
            this.myModel.contactsType = params['type'];
            this.myModel.contactListId = params['contactListId'];
            if (this.myModel.contactListId) {
                this.myModel.savedFilter = JSON.parse(localStorage.getItem('savedFilter'));
            } else {
                this.myModel.savedFilter = '';
                localStorage.removeItem('savedFilter');
            }
            this.loader = true;
            this.myModel.contacts = [];
            this.contactList();
        });
        localStorage.removeItem('savedData');
        this.subscription = this.http.contactUpdatedStatus.subscribe(data => {
            if (data) {
                this.myModel.contacts.forEach((val) => {
                    if (val._id === data.contactId) {
                        val.contactsType = data.contactsType;
                    }
                });
            } else {
                this.allSelect.patchValue('');
                this.contactList();
            }
        });

        this.searchSubscription = this.http.searchStatus.subscribe(data => {
            if (data) {
                this.contactList(data);
                this.myModel.contacts.forEach((val, index) => {
                    if (val._id === data._id) {
                        this.selectContact(val, index);
                    }
                });
            }
        });

        this.contactListSubscription = this.http.eventStatus.subscribe(data => {
            console.log('Come here');
            if (data && data.eventType === 'addContact') {
                this.listsFun();
            }
        });
    }

    ngOnInit() {
        this.allSelect.disable();
    }

    ngOnDestroy(): void {
        this.searchSubscription.unsubscribe();
        this.subscription.unsubscribe();
        this.contactListSubscription.unsubscribe();
    }

    openAddRemoveTag() {
        const obj = {
            contactId: (this.http.getIsSelected(this.myModel.contacts, 'isSelected'))
        };
        this.http.showModal(AddRemoveTagComponent, 'more-sm', obj);
    }

    openContactFilter() {
        const modalRef = this.http.showModal(ContactFilterComponent, 'md');
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(res => {
            if (res) {
                this.myModel.hideTabs = true;
                this.http.heading = 'Filtered';
                this.tab = 'allContact';
                this.myModel.contacts = res;
            } else {
                this.tab = 'contactList';
                this.http.addQueryParams({});
                this.listsFun();
            }
        });
    }

    closedFun() {
        this.selected = {};
        this.selectedIndex = null;
}

    selectContact(data, index) {
        this.selected = data;
        this.selectedIndex = index;
    }

    goToFilter(data) {
        if (data._id) {
            localStorage.setItem('savedFilter', JSON.stringify(data));
            this.contactListId = data._id;
            this.http.addQueryParams({contactListId: data._id, });
        } else {
            if (data.name === 'Leads') {
                this.http.addQueryParams({type: ContactTypes.LEAD});
            } else if (data.name === 'Clients') {
                this.http.addQueryParams({type: ContactTypes.CLIENTS});
            } else if (data.name === 'Manager') {
                this.http.addQueryParams({type: ContactTypes.EMPLOYEE});
            } else {
                this.http.addQueryParams({type: ContactTypes.OHTERS});
            }
        }
    }

    listsFun() {
        const obj: any = {
            skip: 0,
            limit: 100
        };
        if (localStorage.getItem(`hiddenTabs-${this.loginData.activeWorkspaceId}`)) {
            this.hiddenTabs = JSON.parse(localStorage.getItem(`hiddenTabs-${this.loginData.activeWorkspaceId}`));
        }
        this.http.getData(ApiUrl.CONTACT_LISTS, obj).subscribe(res => {
            this.lists = res.data;
            if (this.hiddenTabs && this.hiddenTabs.length) {
                this.lists.forEach((val) => {
                    this.hiddenTabs.forEach((val1) => {
                        if (val.name === val1.name) {
                            val.isHide = true;
                        }
                    });
                });
            }
        }, () => {
        });
    }

    selectAllContact() {
        if (this.allSelect.value) {
            // this.selectedContactCount = this.myModel.totalItems;
            this.showSelected = !this.showSelected;
            this.myModel.contacts.forEach((val) => {
                val.isSelected = true;
            });
            this.getSelectedCount();
        } else {
            this.unselectAll();
        }
    }

    unselectAll() {
        this.myModel.contacts.forEach((val) => {
            val.isSelected = false;
        });
        this.selectedContactCount = 0;
        this.allSelect.patchValue('');
    }

    exportContacts() {
        this.http.postData(ApiUrl.EXPORT_CONTACTS,
                {contactId: JSON.stringify(this.http.getIsSelected(this.myModel.contacts, 'isSelected'))}, true).subscribe(res => {
            this.allSelect.patchValue('');
            this.http.downloadLink(res.data.path);
            this.myModel.contacts.forEach((val) => {
                val.isSelected = false;
            });
            this.http.openSnackBar('Contacts Exported Successfully');
        }, () => {
        });
    }

    deleteFilter() {
        const obj: any = {
            type: 4,
            key: 'id',
            title: 'Only the list will be removed',
            message: 'Removing this list will not remove the contacts within the list.',
            id: this.myModel.contactListId
        };
        const modalRef = this.http.showModal(DeleteComponent, 'xs', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.tab = 'contactList';
            this.getSelectedCount();
            this.http.addQueryParams({});
            this.listsFun();
            this.http.openSnackBar('Contact group have been deleted');
        });
    }

    updateFilter() {
        this.contactsSelectedOnUpdate = [];
        if(this.myModel){
            let getParsedContacts = JSON.parse(localStorage.getItem("savedFilter"));
            this.myModel.contacts.map(element => {
                let selectedContact = getParsedContacts.contacts.find(contact => contact === element._id);
                if(selectedContact){
                    this.contactsSelectedOnUpdate.push({"_id": element._id, "email": element.email});
                }
            });
            console.log('this.myModel:::', this.myModel);
            const obj: any = {
                id: this.myModel.contactListId,
                contacts: this.contactsSelectedOnUpdate,
                tagIds: [],
                name: getParsedContacts.name
            }
            const modalRef = this.http.showModal(ContactFilterComponent, 'md', obj);
        }
    }

    deleteContact() {
        const obj: any = {
            type: 2,
            key: 'contactIds',
            title: 'Delete Contacts',
            message: 'Are you sure you want to delete these contacts?',
            id: JSON.stringify(this.http.getIsSelected(this.myModel.contacts, 'isSelected'))
        };
        const modalRef = this.http.showModal(DeleteComponent, 'xs', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.closedFun();
            this.http.openSnackBar('Contact have been deleted');
            this.http.contactUpdated();
            this.allSelect.patchValue('');
        });
    }

    contactList(data?) {
        const obj: any = {
            skip: this.myModel.currentPage * 100,
            limit: this.myModel.limit,
            contactsType: this.myModel.contactsType
        };

        if (this.myModel.savedFilter) {
            obj.contactListId = this.contactListId ? this.contactListId : "";
        }

        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
                    this.myModel.contacts = res.data.data;
                    this.myModel.allData = res.data;
                    this.myModel.totalItems = res.data.totalCount;
                    this.loader = false;
                    if (data) {
                        this.selectContact(data, 0);
                    }
                    this.getSelectedCount();
                    this.allSelect.enable();
                },
                () => {
                    this.loader = false;
                });
    }

    openContact(data) {
        const modalRef = this.http.showModal(ContactListsComponent, 'more-lg', data.data);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.http.addQueryParams({});
            this.listsFun();
        });
    }

    getSelectedCount() {
        let tempCount = 0;
        this.myModel.contacts.forEach((val) => {
            if (val.isSelected) {
                tempCount++;
            } else {
                this.allSelect.patchValue('');
            }
        });
        this.selectedContactCount = tempCount;
    }

    openAddContact() {
        this.http.showModal(AddContactComponent, '', {});
    }

    importContact() {
        this.http.showModal(ImportContactComponent, '', {});
    }

    clearFilterData() {
        localStorage.removeItem('savedFilter');
        this.http.addQueryParams({});
        this.myModel.hideTabs = false;
        this.http.heading = 'Contacts';
        this.myModel.contactsType=null;
        this.contactList();
    }

}
