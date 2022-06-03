import { ApiUrl } from 'src/app/services/apiUrls';
import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Automation } from 'src/app/internal/automations/models/automation';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-delete-automation',
  templateUrl: './delete-automation.component.html',
  styleUrls: ['./delete-automation.component.css']
})
export class DeleteAutomationComponent implements OnInit {

  modalData: Automation;
  public onClose: Subject<boolean>;
  loader: boolean = false;

  constructor(public http:HttpService) { }

  ngOnInit() {
    
  }

  deleteAutomation() {
    this.loader = true;

    this.http.deleteAutomation(`${ApiUrl.DELETE_AUTOMATION}/${this.modalData._id}` )
    .pipe(finalize(()=> this.loader = false))
    .subscribe(res => {
      console.log(res);
      this.onClose.next(true);
      this.http.hideModal();
    })

  }
  
}
