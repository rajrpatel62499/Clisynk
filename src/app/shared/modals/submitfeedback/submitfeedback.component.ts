import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-submitfeedback',
  templateUrl: './submitfeedback.component.html',
  styleUrls: ['./submitfeedback.component.css']
})
export class SubmitfeedbackComponent implements OnInit {

  constructor(public http:HttpService) { }

  ngOnInit() {
  }

}
