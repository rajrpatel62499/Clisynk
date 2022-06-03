import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {FormControl} from '@angular/forms';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-contact-lists',
    templateUrl: './contact-lists.component.html'
})
export class ContactListsComponent implements OnInit {

    modalData: any;
    search = new FormControl('');
    myModel: any;
    lists: any;
    public onClose: Subject<boolean>;
    hiddenTabs: any = [];
    loginData: any;

    constructor(
        public http: HttpService
    ) {
        this.myModel = new TableModel();
        this.loginData = JSON.parse(localStorage.getItem('loginData'));
    }

    ngOnInit(): void {
        this.listsFun();
    }

    gotoTab(data) {
        this.http.hideModal();
        this.onClose.next(true); 
        if (data._id) {
            localStorage.setItem('savedFilter', JSON.stringify(data));
            this.http.addQueryParams({filterId: data._id});
        } else {
            if (data.name === 'Leads') {
                this.http.addQueryParams({type: 1});
            } else {
                this.http.addQueryParams({type: 2});
            }
        }
    }

    hideTab(data) {
        const totalGroupsStored = this.lists ? this.lists.length : 0;
        const totalGroupAlreadyHidden = JSON.parse(localStorage.getItem(`hiddenTabs-${this.loginData.activeWorkspaceId}`));
        console.log('totalGroupAlreadyHidden::', totalGroupAlreadyHidden);
        data.isHide = (data.isHide === undefined) ? false : data.isHide;
        if((!(totalGroupAlreadyHidden && (totalGroupAlreadyHidden.length < (totalGroupsStored - 2))) && totalGroupAlreadyHidden !== null && !data.isHide) || totalGroupsStored === 2){
            return this.http.openSnackBar('Atleast two group will show in list.');
        }
        if (this.hiddenTabs && this.hiddenTabs.length) {
            this.lists.forEach((val) => {
                this.hiddenTabs.forEach((hideVal, index) => {
                    if (!data.isHide && data.name === val.name) {
                        this.hiddenTabs.push(data);
                    }
                    if(data.isHide && data.name === hideVal.name) {
                        this.hiddenTabs.splice(index, 1);
                    }
                });
            });
        } else {
            this.hiddenTabs.push(data);
        }
        this.hiddenTabs = this.removeDuplicateObject(this.hiddenTabs);
        localStorage.setItem(`hiddenTabs-${this.loginData.activeWorkspaceId}`, JSON.stringify(this.hiddenTabs));
        data.isHide = !data.isHide;
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

    finalSubmit() {
        this.http.hideModal();
    }

    private removeDuplicateObject(objectArray?){
        return objectArray.filter((tab, index) => {
            const _tab = JSON.stringify(tab);
            return index === this.hiddenTabs.findIndex(obj => {
                return JSON.stringify(obj) === _tab;
            });
        });
    }
}
