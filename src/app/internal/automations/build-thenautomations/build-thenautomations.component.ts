import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { SubmitfeedbackComponent } from 'src/app/shared/modals/submitfeedback/submitfeedback.component';

@Component({
  selector: 'app-build-thenautomations',
  templateUrl: './build-thenautomations.component.html',
  styleUrls: ['./build-thenautomations.component.css']
})
export class BuildThenautomationsComponent implements OnInit {

  constructor(public http:HttpService) { }

  ngOnInit() {
  }
  openSubmitfeedback() {
    this.http.showModal(SubmitfeedbackComponent);
  }

}
