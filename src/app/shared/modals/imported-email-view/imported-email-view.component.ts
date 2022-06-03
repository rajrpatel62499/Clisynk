import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-imported-email-view',
  templateUrl: './imported-email-view.component.html',
  styleUrls: ['./imported-email-view.component.css']
})
export class ImportedEmailViewComponent implements OnInit {

  modalData: {emails: string[]};
  constructor() { }

  ngOnInit() {
  }

}
