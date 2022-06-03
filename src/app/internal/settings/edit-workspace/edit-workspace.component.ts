import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ApiUrl } from '../../../services/apiUrls';
import { ActivatedRoute } from '@angular/router';
import { MergeContactsComponent } from '../../../shared/modals/merge-contacts/merge-contacts.component';
import { Subject } from 'rxjs';
import { Workspace } from 'src/app/models/workspace';

@Component({
  selector: 'app-edit-workspace',
  templateUrl: './edit-workspace.component.html',
  styleUrls: ['./edit-workspace.component.css']
})
export class EditWorkspaceComponent implements OnInit {

  form: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  workspaceCtrl = new FormControl();
  workspaces: string[] = [];
  dropdownSettingsWorkspace: any = {
    idField: '_id',
    textField: 'name',
    itemsShowLimit: 4,
    allowSearchFilter: true,
    'disabled': true
  };
  dropdownSettingsContacts: any = {
    idField: '_id',
    textField: 'showName',
    itemsShowLimit: 4,
    allowSearchFilter: true,
    'disabled': true
  };
  dropdownSettingsTags: any = {
    idField: '_id',
    textField: 'name',
    itemsShowLimit: 4,
    allowSearchFilter: true,
    'disabled': true
  };
  dropdownSettingsContactsGroup: any = {
    idField: '_id',
    textField: 'name',
    itemsShowLimit: 4,
    allowSearchFilter: true,
    'disabled': true
  };
  allWorkspaces: any = [];
  selectedWorkspaces: any =[];
  totalContacts: number;
  contactsSelected = 0;
  contacts: any = [];
  contactGroupLists: any[] = [];
  tags: any = [];
  fromWorkspaceId: any;
  fromWorkspaceName: any;

  modalData: any;
  public onClose: Subject<boolean>;

  constructor(public http: HttpService, private route: ActivatedRoute) {
    //   this.route.queryParams.subscribe(params => {
    //     this.fromWorkspaceId = params['workspaceId'];
    //     this.fromWorkspaceName = params['workspaceName'];
    // });
   }

  ngOnInit() {
    console.log(this.modalData);
    if (this.modalData) {
      this.fromWorkspaceId = this.modalData.workspaceId;
      this.fromWorkspaceName = this.modalData.workspaceName;
    }
    this.formInit();
    this.workspaceLists();
    this.contactList();
    this.contactTagList();
    this.contactGroupList();
  }

  formInit() {
    this.form = this.http.fb.group({
        fromWorkspaceId: [{value: this.fromWorkspaceName, disabled: true}, Validators.required],
        toWorkspaceIds: ['', Validators.required],
        contactListIds: [''],
        contactIds: ['', Validators.required],
        tagIds: ['']
    });
  }

  contactTagList(){
    const obj: any = {};
    this.http.getData(ApiUrl.TAGS, obj).subscribe(res => {
        this.tags = res.data.data;
      },
    () => {});
  }

  workspaceLists(){
    const obj: any = {};
    this.http.getData(ApiUrl.WORKSPACE, obj).subscribe(res => {
        this.allWorkspaces = res.data;
        const index: number = this.allWorkspaces.map(function(e) { return e._id; }).indexOf(this.fromWorkspaceId);
        if (index !== -1) {
          this.allWorkspaces.splice(index, 1);
        }
    }, () => {});
  }

  contactList() {
    const obj: any = {
        skip: 0,
        limit: 1000
    };
    this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
        this.contacts = res.data.data;
        this.totalContacts = res.data.totalCount;
        res.data.data.forEach((val) => {
            this.http.checkLastName(val);
            if (val.email) {
                val.showName = val.showName + ` (${val.email})`;
            }
        });
    });
  }

  contactGroupList() {
    const obj: any = {
        skip: 0,
        limit: 1000
    };
    this.http.getData(ApiUrl.CONTACT_LISTS, obj).subscribe(res => {
        this.contactGroupLists = res.data;
        this.contactGroupLists = this.contactGroupLists.filter(x => !this.http.isNullOrEmpty(x._id));
    });
  }

  finalSubmit() {
    const originalObj : any = JSON.parse(JSON.stringify(this.form.value));
    originalObj.fromWorkspaceName = this.fromWorkspaceName ? this.fromWorkspaceName : "";
    originalObj.fromWorkspaceId = this.fromWorkspaceId ? this.fromWorkspaceId : "";
    originalObj.selectedWorkspacesName = this.selectedWorkspaces;
    if (this.http.isFormValid(this.form)) {
      this.http.showModal(MergeContactsComponent, 'md', originalObj);
    }
  }

  public onItemSelect(item: any) {}

  public onDeSelect(item: any) {}

  public onSelectAll(items: any) {}

  public onDeSelectAll(items: any) {}

  public onItemSelectWps(item: any) {
      this.selectedWorkspaces.push(item);
  }

  public onDeSelectWps(item: any) {
      const index: number = this.selectedWorkspaces.map(function(e) { return e._id; }).indexOf(item._id);
    if (index !== -1) {
        this.selectedWorkspaces.splice(index, 1);
    }
  }

  public onSelectAllWps(items: any) {
      this.selectedWorkspaces = this.allWorkspaces;
  }

  public onDeSelectAllWps(items: any) {this.selectedWorkspaces = [];}

}
