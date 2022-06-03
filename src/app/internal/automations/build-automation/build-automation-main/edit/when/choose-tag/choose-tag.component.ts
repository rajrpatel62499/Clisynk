import { PaginatedResponse } from './../../../../../../../models/paginated-response';
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
import { Tag } from 'src/app/models/tag';
import { AddTagComponent } from 'src/app/shared/modals/add-tag/add-tag.component';


@Component({
  selector: 'app-choose-tag',
  templateUrl: './choose-tag.component.html',
  styleUrls: ['./choose-tag.component.css']
})
export class ChooseTagComponent implements OnInit {

  tags: Tag[] = [];
  sortedData: Tag[] = [];
  searchText = '';
  constructor(public http: HttpService,
    public automationService: AutomationService,
    public appoint: AppointmentService,
    public router: Router,
    public loadingService: LoadingService) { }

  async ngOnInit() {
    await this.loadData();
    console.log("tags loaded");
    // this.getAppointmentTypes();
  }

  async loadData() {
    this.sortedData.splice(0, this.sortedData.length);
    this.loadingService.loadingOn()
    const data = await forkJoin([this.getAppointmentTypes()])
      .pipe(finalize(() => this.loadingService.loadingOff())).toPromise();
    console.log(data)
  }

  getAppointmentTypes() {
    return this.http.getData(ApiUrl.TAGS, {})
      .pipe(
        map((res: BackendResponse<PaginatedResponse<Tag[]>>) => res.data),
        tap((x: PaginatedResponse<Tag[]>) => {
          this.tags = x.data;
          this.sortedData = x.data;
        })
      );

  }

  onSelectTag(tag: Tag) {
    const whenEvent: FormGroup = this.automationService.getWhenEvent();
    const tagCategoryName = tag.tagCategoryId ? tag.tagCategoryId.name ? tag.tagCategoryId.name : '' : '';
    whenEvent.patchValue({
      eventData: {
        dataId: tag._id,
        params: { name: tag.name, tagCategoryName: tagCategoryName  }
      }
    })
    this.automationService.updateWhenEvent(whenEvent);
    this.automationService.updateEventType(EventType.WHEN);
  }

  openAddTag(data?: any) {
    const modalRef = this.http.showModal(AddTagComponent, 'more-sm', {});
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(async (res) => {
      await this.loadData();
    })
  }

  sortData(sort: Sort) {
    const data = this.tags.slice();
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
