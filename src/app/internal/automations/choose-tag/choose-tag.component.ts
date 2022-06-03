import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-free-consulation',
  templateUrl: './choose-tag.component.html',
  styleUrls: ['./choose-tag.component.css']
})
export class FreeConsultaionThen implements OnInit {

  choosetag: boolean = false;
  aftersubmits: boolean = false;
  notification: boolean = false;
  

  constructor(public http: HttpService) { }

  ngOnInit() {
  }

  onSendnotification(){
      this.choosetag = true;
      this.aftersubmits = false;
      this.notification= false;
    

  }
  
  createtag(){
    this.aftersubmits = true;
    this.choosetag = false;
    this.notification = false;
    
  }


  createtask(){
    this.aftersubmits = false;
    this.choosetag = true;
    this.notification = true;

  }
 


}
  