import { BackendResponse } from './../../../models/backend-response';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../../shared/models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {DeleteComponent} from '../../../shared/modals/delete/delete.component';
import {Subject} from 'rxjs';
import { Product } from 'src/app/models/product';
import { AddProductComponent } from 'src/app/shared/modals/add-product/add-product.component';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.componet.scss'],
})

export class ProductsComponent implements OnInit, OnDestroy {

    myModel: TableModel;
    loader = false;
    searchText: string = '';

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.myModel.subscription = this.http.eventStatus.subscribe(data => {
            if (data && data.eventType === 'addProduct') {
                this.getList();
            }
        });
    }

    ngOnInit(): void {
        this.getList();
    }

    ngOnDestroy(): void {
        this.myModel.subscription.unsubscribe();
    }

    getList() {
        this.loader = true;
        this.myModel.products.splice(0,this.myModel.products.length);
        this.http.getData(ApiUrl.PRODUCTS, {}).subscribe((res:BackendResponse<Product[]>) => {
                    this.myModel.products = res.data;
                    this.loader = false;
                },
                () => {
                    this.loader = false;
                });
    }

    addProduct(product?) {
        const modalRef = this.http.showModal(AddProductComponent, 'md', product);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            console.log("close")
            this.getList();
        })
    }
    deletePro(data) {
        const obj: any = {
            type: 12, key: 'id', title: 'Delete Product',
            message: 'Are you sure you want to delete this product?', id: data._id
        };
        const modalRef = this.http.showModal(DeleteComponent, 'md', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.http.openSnackBar('Product has been deleted');
            this.getList();
        });
    }

}
