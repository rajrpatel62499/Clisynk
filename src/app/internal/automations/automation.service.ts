import { BackendResponse } from 'src/app/models/backend-response';
import { LoadingService } from 'src/app/internal/automations/loading.service';
import { Automation } from 'src/app/internal/automations/models/automation';
import { HttpService } from 'src/app/services/http.service';
import { EventType } from './automation-constants';
import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { ApiUrl } from 'src/app/services/apiUrls';

class SubjectWrapper<T> {
  private eventSelectedSubject = new BehaviorSubject<T>(EventType.WHEN);
  public eventSelected = this.eventSelectedSubject.asObservable();

  constructor(value: EventType) {
    if (value) {
      this.set(value);
    }
  }

  get() {
    return this.eventSelectedSubject.getValue();
  }
  set(value) {
    this.eventSelectedSubject.next(value);
  }
  clear() {
    this.eventSelectedSubject.next(null);
  }

}
@Injectable({
  providedIn: 'root'
})
export class AutomationService {

  private eventSubjectWrapper = new SubjectWrapper<EventType>();
  // private eventSelectedSubject = new BehaviorSubject<EventType>(EventType.WHEN);
  // public eventSelected = this.eventSelectedSubject.asObservable();

  private thenTasksSubject = new BehaviorSubject<FormArray>(new FormArray([]));
  public thenTasks = this.thenTasksSubject.asObservable();

  private whenEventSubject = new BehaviorSubject<FormGroup>(null);
  public whenEvent = this.whenEventSubject.asObservable();

  private reloadAutomationsListSubject = new Subject<boolean>();
  public reloadAutomationsList$ = this.reloadAutomationsListSubject.asObservable();

  private _automation: Automation = null;
  set automation(value) {
    this._automation = value;
  }
  get automation() {
    return this._automation;
  }

  constructor(public http: HttpService, public loadingService: LoadingService,private fb: FormBuilder) { 
    this.eventSubjectWrapper.eventSelected;
    const s = new BehaviorSubject();
    
  }

  //#region EventType

  updateEventType(event: EventType) {
    this.eventSelectedSubject.next(event);
  }
  
  getCurrentEventType() {
    return this.eventSelectedSubject.getValue();
  }
  //#endregion 

  //#region WHEN-EVENT
  updateWhenEvent(whenEvent: FormGroup) {
    this.whenEventSubject.next(whenEvent);
  }
  
  getWhenEvent() {
    return this.whenEventSubject.getValue();
  }
  //#endregion

  //#region THEN-TASKS
  getThenTasksList() {
    return this.thenTasksSubject.getValue();
  }

  updateThenTasksList(thenTasks) {
    this.thenTasksSubject.next(thenTasks);
  }
  
  updateThenTask(thenTask: FormGroup| AbstractControl, index: number = this.currentThenTaskIndex) {
    this.thenTasksSubject.getValue().at(index).patchValue(thenTask.value);
  }
  
  addToThenTasksList(thenTask: FormGroup) {
    if (this.isNullOrEmpty(this.thenTasksSubject.getValue())) {
        this.thenTasksSubject.next(new FormArray([]));
    }
    this.thenTasksSubject.getValue().push(thenTask);
  }

  getThenTaskByIndex(index: number = this.currentThenTaskIndex): AbstractControl|FormGroup {
    if (!this.isNullOrEmpty(this.thenTasksSubject.getValue())) {
      return this.thenTasksSubject.getValue().at(index);
    } else {
      return null;
    }
  }

  removeThenTaskFromList(index: number) {
    this.thenTasksSubject.getValue().removeAt(index);
  }
  //#endregion

  //#region CURRENT-THEN-TASK

  private _currentThenTaskIndex: number = 0;
  set currentThenTaskIndex(index) {
    this._currentThenTaskIndex = index;
  }
  get currentThenTaskIndex() {
    return this._currentThenTaskIndex;
  }


  // getCurrentEditedThenTask(): FormGroup{
  //   // return this.currentThenTaskSubject.getValue();
  //   return this.currentThenTaskSubject.getValue();
  // }

  // getCurrentEditedThenTaskIndex(): number {
  //   return (this.currentThenTaskSubject.getValue().value as ThenEvent).eventData.params.thenTaskIndex;
  // }

  // setCurrentEditedThenTask(thenTask: FormGroup): void {
  //   this.currentThenTaskSubject.next(thenTask);
  // }

  // isThenTaskInEditMode(): boolean {
  //   return !!this.currentThenTaskSubject.getValue();
  // }

  //#endregion

  //#region Resest 

  resetState() {
    this.automation = null;
    this.updateThenTasksList(null);
    this.updateWhenEvent(null);
    this.updateEventType(EventType.WHEN);
  }
  //#endregion

  //#region reloadData
  reloadAutomationsList(reload: boolean) {
    this.reloadAutomationsListSubject.next(reload);
  }
  //#endregion


  //#region Blank FormGroup
  getAutomationObj() {
    const user: User = JSON.parse(localStorage.getItem("loginData"));
    const whenEvent = this.whenEventSubject.getValue();
    const thenTasks = this.thenTasksSubject.getValue();

    const obj: Partial<Automation> = {
      automationName: this.automation && this.automation.automationName ? this.automation.automationName : 'My Automation',
      thenEvents: thenTasks ? thenTasks.value : [],
      workspaceId: user.activeWorkspaceId,
      addedBy: user._id
    };
    
    whenEvent ? obj.whenEvent = whenEvent.value : null; //sending no whenObj if there is no whenEvent.
    this.automation && this.automation._id ? obj._id = this._automation._id  : '';

    return obj;
  }
  
  createWhenEventObj(): FormGroup {
    return this.fb.group({
      eventName: [''],
      eventDescription: [''],
      eventData: this.fb.group({
        dataId: [''],
        params: [{}]
      })
    });
  }

  createThenEventObj(): FormGroup {
    return this.fb.group({
      eventName: '',
      eventDescription: '',
      eventData: this.fb.group({
        dataId: [''],
        params: [{}],
      }),
      isDelayed: [false, Validators.required],
      delayedOptions: this.fb.group({
        delayType: [''],
        dayInterval: this.fb.group({
          intervalType: [''],
          value: [''],
        }),
        timeInterval: this.fb.group({
          intervalType: [''],
          value: [[]],
        }),

      }),
    });
  }
  //#endregion

  //#region API-Calls
  saveAutomation(): Observable<Automation>{

    const obj = this.getAutomationObj();

    this.loadingService.loadingOn();
    return this.http.postAutomation(ApiUrl.ADD_AUTOMATION, obj)
    .pipe(
      map((val: BackendResponse<Automation>) => val.data),
      finalize(() => { this.loadingService.loadingOff(); })
    );
  }
  //#endregion

  //#region Utils
  isNullOrEmpty(value) {
    if(value == undefined || value == '' || value == null){
      return true;
    }else {
      return false;
    }
  }
  //#endregion
}
