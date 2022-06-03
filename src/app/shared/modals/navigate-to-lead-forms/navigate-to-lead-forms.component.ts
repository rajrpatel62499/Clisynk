import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-navigate-to-lead-forms',
  templateUrl: './navigate-to-lead-forms.component.html',
  styleUrls: ['./navigate-to-lead-forms.component.css']
})
export class NavigateToLeadFormsComponent implements OnInit {

  constructor(public http:HttpService) { }

  ngOnInit() {
  }

}
