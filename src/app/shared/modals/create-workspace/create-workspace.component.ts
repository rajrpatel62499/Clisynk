import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router} from '@angular/router';
import { ApiUrl } from '../../../services/apiUrls';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.css']
})
export class CreateWorkspaceComponent implements OnInit {

  form: FormGroup;
  modalData: any;
  loader = false;
  isEdit = false;
  selectedWorkspace: any = {};
  loginData: any;

  constructor(public http: HttpService, private router: Router) {
  }

  ngOnInit() {
    this.formInit();
    if (this.modalData) {
      this.isEdit = true;
      this.fillValues();
    }
    this.loginData = this.http.loginData;
  }

  formInit() {
    this.form = this.http.fb.group({
        name: ['', Validators.compose([Validators.pattern("[a-zA-Z0-9_ ]*"), Validators.required])],
        description: ['']
    });
  }

  getAllWorkspaces(){
    const obj: any = {};
    this.http.getData(ApiUrl.WORKSPACE, obj).subscribe(res => {
        res.data.map(wps => {
          wps.backgroundColor = this.http.getRandomColor();
        });
        this.selectedWorkspace = this.loginData.activeWorkspaceId ? res.data.find((wps) => wps._id === this.loginData.activeWorkspaceId) : {};
        this.http.updateWorkspaceList(res.data);
        this.http.updateWorkspace(this.selectedWorkspace);
        this.http.manipulateWorkspace(true);
    }, () => {});
  }

  finalSubmit() {
    const obj: any = this.removeEmptyObject(JSON.parse(JSON.stringify(this.form.value)));
    if (this.http.isFormValid(this.form)) {
      this.loader = true;
        this.http.postWorkspaceForm(this.isEdit ? ApiUrl.WORKSPACE + `/${this.modalData._id}` : ApiUrl.WORKSPACE, obj).subscribe(() => {
            this.loader = false;
            this.isEdit ? this.http.openSnackBar('Workspace Updated Successfully') : this.http.openSnackBar('Workspace Added Successfully');
            this.http.hideModal();
            this.getAllWorkspaces();
          }, () => {
            this.loader = false;
        });
    }
  }

  removeEmptyObject(data?){
    for (var propName in data) {
      if (data[propName] === null || data[propName] === undefined || data[propName] === "") {
        delete data[propName];
      }
    }
    return data;
  }

  fillValues(){
    this.form.patchValue({
      name: this.modalData.name,
      description: this.modalData.description
    });
  }

}
