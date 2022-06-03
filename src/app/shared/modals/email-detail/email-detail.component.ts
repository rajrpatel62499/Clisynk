import {Component} from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
    selector: 'app-email-detail',
    templateUrl: './email-detail.component.html',
    styleUrls: ['./email-detail.component.scss']
})
export class EmailDetailComponent {

    modalData: any;
    fullview = true;

    constructor(public http: HttpService) {
    }
    
    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.fullview = this.modalData.fullView;
    }

    finalSubmit() {
        this.http.hideModal();
    }

}
