import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-lead-form-deleted',
  templateUrl: './lead-form-deleted.component.html',
  styleUrls: ['./lead-form-deleted.component.css']
})
export class LeadFormDeletedComponent implements OnInit {

  public onClose: Subject<boolean>;

  constructor(public http:HttpService) { }

  ngOnInit() {
  }

  delfun(){
    this.http.hideModal();
   this.onClose.next(true);
            
      
  }

}
