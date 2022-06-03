import { Component } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html'
})
export class LogoutComponent {

    modalData: any;
    public onClose: Subject<boolean>;

    constructor(public http: HttpService) {
    }

    finalLogout() {
        this.http.hideModal();
        this.http.closeAllModals();
        localStorage.removeItem('accessToken');
        this.http.navigate('login');
        // location.reload();
        // window.location.href = 'login';
    }
}
