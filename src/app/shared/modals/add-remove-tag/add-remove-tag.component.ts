import {Component, OnInit} from '@angular/core';
import {TableModel} from '../../models/table.common.model';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import {FormControl, Validators} from '@angular/forms';
import {AddTagComponent} from '../add-tag/add-tag.component';

@Component({
    selector: 'app-add-remove-tag',
    templateUrl: './add-remove-tag.component.html'
})
export class AddRemoveTagComponent implements OnInit {

    myModel: TableModel;
    modalData: any;
    public onClose: Subject<boolean>;
    tagId = new FormControl('', Validators.required);

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.tagList();
    }

    openAddTag() {
        this.http.hideModal();
        this.http.showModal(AddTagComponent, 'more-sm', this.modalData);
    }

    tagList() {
        this.http.getData(ApiUrl.TAGS, {}).subscribe(res => {
            this.myModel.tags = res.data.data;
            if (this.modalData.newTagAdded) {
                this.tagId.patchValue(res.data.data[0]._id);
            }
        });
    }

    applyTag() {
        const obj = {
            contactId: JSON.stringify(this.modalData.contactId),
            tagIds: JSON.stringify([this.tagId.value])
        };
        this.http.hideModal();
        this.http.postData(ApiUrl.ADD_TAG_TO_CONTACT, obj).subscribe(() => {
            this.http.eventSubject.next({eventType: 'addTag'});
            this.http.openSnackBar('Tag successfully applied');
        }, () => {
        });
    }

    removeTag() {
        const obj = {
            contactId: JSON.stringify(this.modalData.contactId),
            tagId: this.tagId.value
        };
        this.http.postData(ApiUrl.REMOVE_TAG_FROM_CONTACT, obj).subscribe(() => {
            this.http.hideModal();
            this.http.eventSubject.next({eventType: 'deleteTag'});
            this.http.openSnackBar('Tag successfully removed');
        }, () => {
        });
    }

}
