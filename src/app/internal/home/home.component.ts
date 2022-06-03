import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ApiUrl} from '../../services/apiUrls';
import {TableModel} from '../../shared/models/table.common.model';
import {Router} from '@angular/router';
import {AppointmentService} from '../appointments/appointment.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

    allData: any = {};
    allWorkspaceData: any = {};
    myModel: any;
    loader = true;


    public constructor(public http: HttpService, public router: Router, public appoint: AppointmentService) {
        this.myModel = new TableModel();
        this.myModel.subscription = this.http.eventStatus.subscribe(data => {
         
            if (data && data.eventType === 'addTask') {
                this.getData();
            }
        });
    }

    ngOnInit() {
        this.getData();
        // this.getAllWorkspace();
    }

    ngOnDestroy(): void {
        this.myModel.subscription.unsubscribe();
    }

    getData() {
        if (!this.allData) {
            this.myModel.loader = true;
        }
        this.http.getData(ApiUrl.DASHBOARD).subscribe(res => {
            this.allData = res.data;
            this.myModel.loader = false;
        }, () => {
            this.myModel.loader = false;
        });
    }

    openMoney(tab?, search?) {
        if (!tab) {
            tab = 1;
        }
        const dataToSend = {tab: tab};
        if (search) {
            dataToSend['search'] = search;
        }
        this.router.navigate(['/money'], {queryParams: dataToSend});
    }

    checkLink(url, flag?) {
        if (this.http.checkAcl(url)) {
            switch (url) {
                case 'contacts':
                    this.http.openModal('addContact');
                    this.http.navigate('contacts');
                    break;
                case 'money':
                    this.http.openModal(flag);
                    break;
                case 'tasks':
                    this.http.openModal('addTask');
                    break;
                case 'broadcast':
                    this.http.navigate('/broadcast/add-broadcast');
                    break;
            }
        } else {
            this.showAccessError();
        }
    }

    showAccessError() {
        this.http.openSnackBar('You are not authorized to access this feature');
        return;
    }

    getAllWorkspace(){
        this.loader = true;
        const obj: any = {};
        this.http.getData(ApiUrl.WORKSPACE, obj).subscribe(res => {
            this.allWorkspaceData = res.data;
            res.data.map(wps => {
            wps.backgroundColor = this.http.getRandomColor();
            });
            let getLoggedUserFromLocalStorage = JSON.parse(localStorage.getItem("loginData"));
            getLoggedUserFromLocalStorage.activeWorkspaceId = this.allWorkspaceData[0]._id ? this.allWorkspaceData[0]._id : "";
            localStorage.setItem("loginData", JSON.stringify(getLoggedUserFromLocalStorage));
            let selectedWorkspace = getLoggedUserFromLocalStorage.activeWorkspaceId ? res.data.find((wps) => wps._id === getLoggedUserFromLocalStorage.activeWorkspaceId) : {};
            let workspaceList = res.data.filter(wps => wps._id !== getLoggedUserFromLocalStorage.activeWorkspaceId);
            setTimeout (() => {
                this.http.updateWorkspaceList(workspaceList);
                this.http.updateWorkspace(selectedWorkspace);
            }, 1000);
            this.loader = false;
        }, () => {
            this.loader = false;
        });
    }

}
