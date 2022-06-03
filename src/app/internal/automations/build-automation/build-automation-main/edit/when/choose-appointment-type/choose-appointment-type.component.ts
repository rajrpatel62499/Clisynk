import { Component, OnInit } from '@angular/core';
import { AutomationService } from 'src/app/internal/automations/automation.service';
import { LoadingService } from 'src/app/internal/automations/loading.service';
import { HttpService } from 'src/app/services/http.service';
import { Sort } from '@angular/material/sort';
import { FormGroup } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { EventType } from 'src/app/internal/automations/automation-constants';
import { finalize, map, tap } from 'rxjs/operators';
import { BackendResponse } from 'src/app/models/backend-response';
import { ApiUrl } from 'src/app/services/apiUrls';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/internal/appointments/appointment.service';
import { NavigateToAppointmentComponent } from 'src/app/shared/modals/navigate-to-appointment/navigate-to-appointment.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-appointment-type',
  templateUrl: './choose-appointment-type.component.html',
  styleUrls: ['./choose-appointment-type.component.css']
})
export class ChooseAppointmentTypeComponent implements OnInit {

  appointments: Appointment[];
  leadForm: Appointment;
  sortedData: Appointment[];
  searchText = '';
  constructor(public http: HttpService, 
    public automationService: AutomationService,
    public appoint: AppointmentService,
    public router: Router,
    public loadingService: LoadingService) { }

  async ngOnInit() {
    await this.loadData();
    console.log("data loaded");
    // this.getAppointmentTypes();
  }

  async loadData() {
    this.loadingService.loadingOn()
    const data = await forkJoin([this.getAppointmentTypes()])
      .pipe(finalize(() => this.loadingService.loadingOff())).toPromise();
    console.log(data)
  }

  getAppointmentTypes() {
    return this.http.getData(ApiUrl.APPOINTMENT_LIST_TYPES, {})
        .pipe(
          map((res: BackendResponse<Appointment[]>) => res.data),
          tap(x => {
            this.appointments = x;
            this.sortedData = x;
          })
        );
      
  }
  
  onSelectForm(form: Appointment) {
    const whenEvent: FormGroup = this.automationService.getWhenEvent()
    whenEvent.patchValue({
      eventData :{
        dataId : form._id,
        params : { name: form.name}
      }
    })
    this.automationService.updateWhenEvent(whenEvent);
    this.automationService.updateEventType(EventType.WHEN);
  }

  openAddAppointment(data?: any) {
    const modalRef = this.http.showModal(NavigateToAppointmentComponent, 'xs lead-form-popup-main navigated-appointment-modal');
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe((res) => {
      
      if (res) {
        this.router.navigate(["appointments"]);
      }
    })
  }

  sortData(sort: Sort) {
    const data = this.appointments.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'link': return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        // case 'addedOn': return this.compare(format(new Date(a.createdAt), 't'), format(new Date(b.createdAt), 't'), isAsc);
        // case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
