import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workspace } from 'src/app/models/workspace';
import { HttpService } from 'src/app/services/http.service';
import { CreateWorkspaceComponent } from 'src/app/shared/modals/create-workspace/create-workspace.component';
import { ApiUrl } from '../../../services/apiUrls';
import { EditWorkspaceComponent } from '../edit-workspace/edit-workspace.component';

@Component({
  selector: 'app-manage-workspace',
  templateUrl: './manage-workspace.component.html',
  styleUrls: ['./manage-workspace.component.css']
})
export class ManageWorkspaceComponent implements OnInit {

  allData: any[] = [];
  workspaceId: any;
  loginData: any;
  loader = false;
  selectedWorkspace: any = {};
  searchText: string = "";

  constructor(public http: HttpService, private router: Router) {
    this.http.work.subscribe((res) => {
      if (res) {
        this.getAllWorkspaces(false);
      }
    })
  }

  ngOnInit() {
    this.getAllWorkspaces(false);
    this.loginData = this.http.loginData;
  }

  getAllWorkspaces(isDeleted?) {
    this.loader = true;
    const obj: any = {};
    this.allData.splice(0, this.allData.length);
    this.http.getData(ApiUrl.WORKSPACE, obj).subscribe(res => {
      this.allData = res.data;
      res.data.map(wps => {
        wps.backgroundColor = this.http.getRandomColor();
      });
      if (isDeleted) {
        let getLoggedUserFromLocalStorage = JSON.parse(localStorage.getItem("loginData"));
        getLoggedUserFromLocalStorage.activeWorkspaceId = this.allData[0]._id ? this.allData[0]._id : "";
        this.selectedWorkspace = getLoggedUserFromLocalStorage.activeWorkspaceId ? res.data.find((wps) => wps._id === getLoggedUserFromLocalStorage.activeWorkspaceId) : {};
        localStorage.setItem("loginData", JSON.stringify(getLoggedUserFromLocalStorage));
        this.http.updateWorkspaceList(res.data);
        this.http.deleteWorkspaceEvent(true);
        this.http.workspaceList.subscribe(wps => this.allData = wps);
        this.http.updateWorkspace(this.selectedWorkspace);
      } else {
        this.loginData = this.http.loginData;
        this.selectedWorkspace = this.loginData.activeWorkspaceId ? res.data.find((wps) => wps._id === this.loginData.activeWorkspaceId) : {};
        console.log(this.selectedWorkspace);

        // this.http.updateWorkspaceList(res.data);
        // this.http.workspaceList.subscribe(wps=> this.allData = wps);
      }
      this.loader = false;
    }, () => { });
  }

  openEditWorkspace(data) {
    this.http.showModal(CreateWorkspaceComponent, 'md', data);
  }

  openEditManageWorkspace(workspace: Workspace) {
    let data = {
      workspaceId: workspace._id,
      workspaceName: workspace.name
    }
    console.log(data);
    
    this.http.showModal(EditWorkspaceComponent, 'md', data);
  }

  deleteWorkspace(template, workspaceId) {
    this.workspaceId = workspaceId;
    this.http.showModal(template, 'md');
  }

  changeStatus(status) {
    const obj = {
      status: status,
      workspaceId: this.workspaceId
    };
    this.http.deleteWorkspace(ApiUrl.WORKSPACE + `/${this.workspaceId}`).subscribe(() => {
      if (status === 2) {
        this.http.openSnackBar('Workspace Completed Successfully');
        this.getAllWorkspaces(true);
      } else {
        this.http.openSnackBar('Workspace Deleted Successfully');
        this.getAllWorkspaces(true);
      }
      // this.getAllWorkspaces(true);
      // this.reload('settings/manage-workspace');
    });
  }

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('', { skipLocationChange: true });
    // this.ngxUiLoaderService.stopLoader("workspace-switch");
    return this.router.navigateByUrl(url);
  }

}
