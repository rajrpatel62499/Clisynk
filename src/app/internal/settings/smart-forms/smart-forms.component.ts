import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Subject } from 'rxjs';
import { SmartFormCreateComponent } from 'src/app/shared/modals/smart-form-create/smart-form-create.component';
import { SmartFormDeleteComponent } from "src/app/shared/modals/smart-form-delete/smart-form-delete.component";
import { BsModalService } from 'ngx-bootstrap';
import { Sort } from '@angular/material/sort';
import { format } from 'date-fns'

@Component({
  selector: 'app-smart-forms',
  templateUrl: './smart-forms.component.html',
  styleUrls: ['./smart-forms.component.css']
})
export class SmartFormsComponent implements OnInit {
  formsList: any[];
  sortedData: any = [];
  loader: any;
  searchText: string = "";
  
  constructor(public http: HttpService, public modalService: BsModalService) { }

  ngOnInit() {
    this.getSmartFormList();
  }

  getSmartFormList() {
    // this.myModel = new TableModel();
    this.loader = true;
    this.sortedData.splice(0, this.sortedData.length);
    this.http.getSmartForm().subscribe(res => {
        console.log(res.data);
        if(res){
          this.formsList = res.data;
          this.formsList.forEach( res => {
            let date = new Date(res.createdAt);
            res.createdAt = date;
          })
          this.sortedData = this.formsList.slice();
        }
        this.loader = false;
    }, () => {
        this.loader = false;
    });
  }

  onUpdate(data){
    if(data.status != "PUBLISHED"){
    console.log(data);
    const modalRef = this.http.showModal(SmartFormCreateComponent, 'custom-class-for-create-smart-form', data,);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(() =>{
      this.getSmartFormList();  
    })
    }
  }

  onCreateForm(data?) {
    const modalRef = this.http.showModal(SmartFormCreateComponent, 'custom-class-for-create-smart-form', data,);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(() =>{
      this.getSmartFormList();  
    })
    
    // console.log(this.http.modalRef);
    
    // const initialState: any = {};
    // this.modalService.show(SmartFormCreateComponent, {
    //   initialState, keyboard: true, class: `zz'}`
    //   // initialState, keyboard: true, class: `gray modal-${size ? size : 'md'}`, backdrop: 'static'
    // })
    // this.modalService.onHidden.subscribe((res) => {
    //   console.log('-----');
    // })
  }

  onDelete(data) {
    const modalRef = this.http.showModal(SmartFormDeleteComponent, 'md', data);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(res => {
      if (res) {
        this.sortedData.forEach((form, i) => {
          if(data == form['_id']){
            this.sortedData.splice(i, 1);
          }
        })
        this.formsList.forEach((form, i) => {
          if(data == form['_id']){
            this.formsList.splice(i, 1);
          }
        })
      }
    });
  }

  copyLink(id){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = window.location.origin + "/preview-smartform/" + id;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.http.openSnackBar('Form link copied successfully');
}

  sortData(sort: Sort) {
    const data = this.formsList.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'addedOn': return this.compare(format(a.createdAt, 't'), format(b.createdAt, 't'), isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
