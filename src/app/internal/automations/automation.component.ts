import { AutomationService } from 'src/app/internal/automations/automation.service';
import { ApiUrl } from 'src/app/services/apiUrls';
import { LoadingService } from './loading.service';
import { Observable, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { SubmitfeedbackComponent } from 'src/app/shared/modals/submitfeedback/submitfeedback.component';
import { RenameAutomationComponent } from 'src/app/shared/modals/rename-automation/rename-automation.component';
import { DeleteAutomationComponent } from 'src/app/shared/modals/delete-automation/delete-automation.component';
import { AutomationParams } from './models/params';
import { Automation } from './models/automation';
import { BackendResponse } from '../../models/backend-response';
import { User } from 'src/app/models/user';
import { map, finalize, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.css']
})
export class AutomationComponent implements OnInit, OnDestroy {

  automationParams = new AutomationParams();

  rightdefault = false;

  constructor(public http: HttpService, public loadingService: LoadingService, 
    private router: Router,
    public automationService: AutomationService) {
    this.loadAutomations();
    const reloadSub = this.automationService.reloadAutomationsList$.subscribe((reload: boolean) =>{
      console.log(reload);
      if (reload) {
        this.loadAutomations();
        console.log('reloaded')
        reloadSub.unsubscribe();
        this.automationService.reloadAutomationsList(false);
      } else { /*do nothing */}
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log("SAVE THE AUTOMATION");
  }

  loadAutomations() {
    let user: User = JSON.parse(localStorage.getItem("loginData"));
    this.automationParams.workspaceId = user.activeWorkspaceId;
    this.loadingService.loadingOn();
    this.http.updateAutomationsList([]);
    this.http.getData(ApiUrl.GET_AUTOMATIONS, this.automationParams)
      .pipe(
        map((res: BackendResponse<Automation[]>) => res.data),
        finalize(() => this.loadingService.loadingOff()),
        shareReplay()
      )
      .subscribe(data => this.http.updateAutomationsList(data));
  }

  openRenameautomation(automation: Automation) {
    const modalRef = this.http.showModal(RenameAutomationComponent, 'sm custom-class-rename-automation', automation);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe((res) => {
      if (res) { this.loadAutomations(); }
      console.log("renamed");
    })
  }

  openSubmitfeedback() {
    this.http.showModal(SubmitfeedbackComponent);
  }

  openDeleteautomation(automation: Automation) {
    const modalRef = this.http.showModal(DeleteAutomationComponent, 'xs', automation);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe((res) => {
      if (res) { this.loadAutomations(); console.log("deleted");}
    })
  }

  editAutomation(automation: Automation) {
    this.automationService.resetState();

    if (!this.automationService.isNullOrEmpty(automation.whenEvent)) {
      const whenEvent = this.automationService.createWhenEventObj()
      whenEvent.patchValue(automation.whenEvent);
      this.automationService.updateWhenEvent(whenEvent);
    }
    
    automation.thenEvents.forEach(thenEvent => {
      const thenEventGroup = this.automationService.createThenEventObj()
      thenEventGroup.patchValue(thenEvent);
      this.automationService.addToThenTasksList(thenEventGroup);
    })

    this.automationService.automation = automation;
    
    this.router.navigate(["/automation/build-automation-main"]);
    this.rightdefault = true;
  }

  Closepreview() {
    this.rightdefault = false;
  }


}
