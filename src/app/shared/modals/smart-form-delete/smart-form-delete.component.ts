import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-smart-form-delete',
  templateUrl: './smart-form-delete.component.html',
  styleUrls: ['./smart-form-delete.component.css']
})
export class SmartFormDeleteComponent implements OnInit {

  constructor(public http: HttpService) { }

  ngOnInit() {
  }

  modalData: any;
  public onClose: Subject<boolean>;

  deleteFun() {
    this.http.hideModal();
    this.http.deleteSmartForm(this.modalData).subscribe(() => {      
        this.onClose.next(true);
        this.http.updateSmartFormList(true);
    });
}

}
