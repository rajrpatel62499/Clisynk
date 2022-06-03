import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { TableModel } from '../../../shared/models/table.common.model';
import { AddUserComponent } from '../../../shared/modals/add-user/add-user.component';
import { Subject } from 'rxjs';
import { ApiUrl } from '../../../services/apiUrls';
import { PaginatedResponse } from 'src/app/models/paginated-response';
import { BackendResponse } from 'src/app/models/backend-response';
import { AclService } from 'src/app/services/acl.service';
import { finalize } from 'rxjs/operators';
import { DeleteComponent } from 'src/app/shared/modals/delete/delete.component';
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

    myModel: TableModel;
    modalData: any;
    isEdit = false;
    isLoading = false;
    searchText: string = "";
    public onClose: Subject<boolean>;


    constructor(public http: HttpService, public acl: AclService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.getList();
    }

    openAddUser(data?: User) {
        const modalRef = this.http.showModal(AddUserComponent, 'md', data);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(res => {
            this.getList();
        });
    }
    
    deleteFun(data:User) {
        const obj: any = {
            type: 11,
            key: 'id',
            message: 'Are you sure you want to delete this user?',
            id: data._id
        };
        const modalRef = this.http.showModal(DeleteComponent, 'sm', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.http.openSnackBar('Deleted Successfully');
            this.getList();
        });
    }

    getList() {
        this.isLoading = true;
        this.http.getData(ApiUrl.USER_LIST, {})
            .pipe(finalize(() => { this.isLoading = false; }))
            .subscribe((res: BackendResponse<PaginatedResponse<User[]>>) => {
                console.log(res);
                this.myModel.users = res.data;
                this.myModel.users.data.forEach(user => { user.displayedRoles = this.acl.getSubUserRoles(user); })
            });
    }


}
