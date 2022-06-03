import {Component, Input, ChangeDetectorRef} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {NOTIFICATION_TYPES} from '../../../services/constants';
import {AddTaskComponent} from '../add-task/add-task.component';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html'
})
export class NotificationsComponent {

    myModel: any;
    types: any;
    @Input() allData: any;

    constructor(public http: HttpService, private cdr: ChangeDetectorRef) {
        this.types = NOTIFICATION_TYPES;
    }

    openNotification(data) {
        switch (data.type) {
            case 1  :
            case 2  :
            case 3  :
            case 4  :
                this.http.openModal('addInvoice', data.id);
                break;
            case 5:
                this.http.showModal(AddTaskComponent, 'md', data.id);
                break;
            case 6:
                this.http.navigate('broadcast');
                this.closeNoti();
                break;
            case 7:
            case 8:
                this.http.navigate('appointments');
                this.closeNoti();
                break;
        }
    }

    ngAfterContentInit() {
        this.cdr.detectChanges();
    }

    closeNoti() {
        document.getElementById('notifications-panel').style.width = '0';
    }
}
