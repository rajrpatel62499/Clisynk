import { AddProductComponent } from './../../../../../../../shared/modals/add-product/add-product.component';
import { Component, OnInit } from '@angular/core';
import { AutomationService } from 'src/app/internal/automations/automation.service';
import { LoadingService } from 'src/app/internal/automations/loading.service';
import { HttpService } from 'src/app/services/http.service';
import { Sort } from '@angular/material/sort';
import { FormGroup } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { EventType } from 'src/app/internal/automations/automation-constants';
import { finalize, map, tap } from 'rxjs/operators';
import { BackendResponse } from 'src/app/models/backend-response';
import { ApiUrl } from 'src/app/services/apiUrls';
import { AppointmentService } from 'src/app/internal/appointments/appointment.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';



@Component({
  selector: 'app-choose-product',
  templateUrl: './choose-product.component.html',
  styleUrls: ['./choose-product.component.css']
})
export class ChooseProductComponent implements OnInit {

  products: Product[] = [];
  leadForm: Product;
  sortedData: Product[] = [];
  searchText = '';
  constructor(public http: HttpService,
    public automationService: AutomationService,
    public appoint: AppointmentService,
    public router: Router,
    public loadingService: LoadingService) { }

  async ngOnInit() {
    await this.loadData();
    console.log("products loaded");
    // this.getAppointmentTypes();
  }

  async loadData() {
    this.loadingService.loadingOn();
    this.sortedData.splice(0, this.sortedData.length);
    const data = await forkJoin([this.getProducts()])
      .pipe(finalize(() => this.loadingService.loadingOff())).toPromise();
    console.log(data)
  }

  getProducts() {
    return this.http.getData(ApiUrl.PRODUCTS, {})
      .pipe(
        map((res: BackendResponse<Product[]>) => res.data),
        tap((x: Product[]) => {
          this.products = x;
          this.sortedData = x;
        })
      );

  }

  onSelectProduct(product: Product) {
    const whenEvent: FormGroup = this.automationService.getWhenEvent();
    whenEvent.patchValue({
      eventData: {
        dataId: product._id,
        params: { name: product.name, price: product.price  }
      }
    })
    this.automationService.updateWhenEvent(whenEvent);
    this.automationService.updateEventType(EventType.WHEN);
  }

  openAddProduct(data?: any) {
    const modalRef = this.http.showModal(AddProductComponent, 'new-md', {});
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(async (res) => {
      await this.loadData();
    })
  }
}

