import {Component, Input, OnChanges} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {ContactDetailsComponent} from '../contact-details/contact-details.component';
import {AddTaskComponent} from '../add-task/add-task.component';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html'
})
export class TaskListComponent {

    @Input() allData: any;
    @Input() hideContactName: boolean;
    myModel: any;
    todayDate: any = new Date().getTime();

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    openContactDetails(data) {
        const obj = {
            data: data.contactId,
            eventType: 'taskList'
        };
        this.http.showModal(ContactDetailsComponent, 'md', obj);
    }

    changeStatus(data, status) {
        const obj = {
            status: status,
            taskId: data._id
        };
        data.status = status;
        this.http.getData(ApiUrl.UPDATE_TASK, obj).subscribe();
    }

    openEditTask(data) {
        this.http.showModal(AddTaskComponent, 'md', data);
    }

}
