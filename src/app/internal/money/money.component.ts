import { PreviewInvoiceComponent } from './../../shared/modals/preview-invoice/preview-invoice.component';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TableModel} from '../../shared/models/table.common.model';
import {HttpService} from '../../services/http.service';
import {ApiUrl} from '../../services/apiUrls';
import {ActivatedRoute} from '@angular/router';
import {DeleteComponent} from '../../shared/modals/delete/delete.component';
import {Subject} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-money',
    templateUrl: './money.component.html',
    styleUrls: ['./money.component.scss']
})

export class MoneyComponent implements OnInit, OnDestroy {

    myModel: TableModel;
    search = new FormControl();
    tempEndDate = new Date().setUTCHours(23, 59, 59);
    todayEnd = new Date(this.tempEndDate).toISOString();
    selectedTab = 1;
    sortType = undefined;
    sortValue = 1;

    constructor(public http: HttpService, public activeRoute: ActivatedRoute) {
        this.myModel = new TableModel();
        this.myModel.subscription = this.http.eventStatus.subscribe(data => {
            if (data && data.eventType) {
                this.addressList();
                this.invoiceList();
            }
        });
        const tab = this.activeRoute.snapshot.queryParams.tab;
        const search = this.activeRoute.snapshot.queryParams.search;
        if (tab) {
            this.selectedTab = parseInt(tab, 10);
        }
        if (search) {
            this.search.setValue(search);
        }
    }

    ngOnInit() {
        this.invoiceList(true);
        this.addressList();
        this.http.test.emit({hi: 'dsdsd'});
    }

    ngOnDestroy(): void {
        this.myModel.subscription.unsubscribe();
    }

    makeDefault(data) {
        const obj: any = {
            addressId: data._id
        };
        this.http.postData(ApiUrl.SET_DEFAULT_ADDRESS, obj).subscribe(res => {
            this.http.openSnackBar('Default Address set successfully');
            this.addressList();
        });
    }

    deleteAddress(data) {
        const obj: any = {
            type: 7,
            key: 'id',
            title: 'Delete Address',
            message: 'Are you sure you want to delete this address?',
            id: data._id
        };
        const modalRef = this.http.showModal(DeleteComponent, 'xs', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.http.openSnackBar('Address has been deleted');
            this.addressList();
        });
    }

    clickHeader(val) {
        if (val === this.sortType) {
            if (this.sortValue === 1) {
                this.sortValue = -1;
            } else {
                this.sortValue = 1;
            }
        } else {
            this.sortType = val;
        }
        this.invoiceList();
    }
    invoiceSkip = 0;
    invoiceLimit = 5;
    totalInvoices = 0;
    pageChange(event: PageEvent) {
        console.log(event);
        this.invoiceSkip = event.pageIndex;
        this.invoiceLimit = event.pageSize;
        this.invoiceList();
      }

    invoiceList(loader?) {
        const obj: any = {
            type: this.selectedTab,
            search: this.search.value ? this.search.value : '',
            sortType: this.sortType,
            sortValue: this.sortValue,
            skip : this.invoiceSkip,
            limit : this.invoiceLimit
        };
        this.myModel.loader = true;
        this.myModel.allData = null;
        this.http.getData(ApiUrl.QUOTES_LIST, obj).subscribe((res) => {
            this.myModel.allData = res.data;
            console.log("MONEY DATA => ", this.myModel.allData);
            this.totalInvoices = res.data.count;
            console.log(this.totalInvoices);
            console.log(res)
            this.myModel.loader = false;
        }, (err) => {
            console.log(err);
            this.myModel.loader = false;
        });
    }

    addressList() {
        this.http.getData(ApiUrl.ADDRESS_LIST, {}).subscribe((res) => {
            this.myModel.addresses = res.data;
            console.log(res)
        });
    }

    openAddInvoice(type) {
        (type === 1) ? this.http.openModal('addInvoice') : this.http.openModal('addQuote');
    }

    openPreviewInvoice() {
        this.http.showModal(PreviewInvoiceComponent, 'md preview-invoice-class');
    
    }

    cloneInvoice(data) {
        console.log(data);
    }

}
