import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-edit-note',
    templateUrl: './edit-note.component.html'
})
export class EditNoteComponent implements OnInit {

    form: FormGroup;
    modalData: any;
    public onClose: Subject<boolean>;
    contacts: any = [];
    obj: any = {};

    constructor(public http: HttpService, public activeRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.formInit();
        this.activeRoute.queryParams.subscribe(params => {
            this.obj.contactId = params['contactId'];
        });
        this.obj.noteId = this.modalData._id;
    }

    formInit() {
        this.form = this.http.fb.group({
            text: [this.modalData.text, Validators.required]
        });
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            this.obj.text = this.form.value.text;
            this.http.hideModal();
            this.http.postData(ApiUrl.ADD_EDIT_NOTES, this.obj).subscribe(() => {
                this.http.openSnackBar('Note updated Successfully');
                this.onClose.next(true);
            }, () => {
            });
        }
    }

    deleteFun() {
        const obj: any = {
            type: 1,
            id: this.modalData._id
        };
        this.http.hideModal();
        this.http.postData(ApiUrl.DELETE_DATA, obj).subscribe(() => {
            this.http.openSnackBar('Deleted Successfully');
            this.onClose.next(true);
        });
    }

}
