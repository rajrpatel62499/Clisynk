import { ApiUrl } from 'src/app/services/apiUrls';
import { finalize } from 'rxjs/operators';
import { Automation } from './../../../internal/automations/models/automation';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-rename-automation',
  templateUrl: './rename-automation.component.html',
  styleUrls: ['./rename-automation.component.css']
})
export class RenameAutomationComponent implements OnInit {

  modalData: Automation;
  public onClose: Subject<boolean>;
  loader: boolean = false;


  automationName = new FormControl('', Validators.required);

  constructor(public http: HttpService) { }

  ngOnInit() {
    console.log(this.modalData);
    this.automationName.setValue(this.modalData.automationName);
  }

  updateAutomation() {
    if (this.automationName.invalid) {
      return;
    }

    const obj: Automation = Object.assign({}, this.modalData);
    obj.automationName = this.automationName.value;
    obj.thenEvents.forEach(x => {
      delete x._id
    });
    delete obj.createdAt;
    delete obj.isDeleted;
    delete obj.updatedAt;
    delete obj.__v;



    this.loader = true;
    this.http.postAutomation(ApiUrl.ADD_AUTOMATION, obj)
      .pipe(finalize(() => { this.loader = false; }))
      .subscribe(res => {
        console.log(res);
        this.http.hideModal();
        this.onClose.next(true);
      })
  }

}
