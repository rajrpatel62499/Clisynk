import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {Subject} from 'rxjs';
import {AddTagCategoryComponent} from '../add-tag-category/add-tag-category.component';

@Component({
    selector: 'app-add-tag',
    templateUrl: './add-tag.component.html'
})
export class AddTagComponent implements OnInit {

    form: FormGroup;
    myModel: any;
    modalData: any;
    public onClose: Subject<boolean>;
    myControl = new FormControl('');
    contacts: any = [];
    isSelected = false;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        this.categoryList();
        if (this.modalData.isEdit) {
            this.fillValues();
        }
    }

    finalSelected() {
        this.isSelected = true;
        if (this.myControl.value) {
            const temp = JSON.parse(JSON.stringify(this.myControl.value));
            this.myControl.patchValue(temp.name);
            this.form.controls.tagCategoryId.patchValue(temp._id);
        }
    }

    clearSearch() {
        if (!this.isSelected) {
            this.myControl.patchValue('');
        }
    }

    categoryList() {
        this.isSelected = false;
        const obj: any = {
            skip: 0,
            limit: 1000
        };
        this.http.getData(ApiUrl.TAG_CATEGORIES, obj).subscribe(res => {
                    this.myModel.categories = res.data;
                    if (this.modalData.newTagCategoryAdded) {
                        this.myControl.patchValue(this.myModel.categories[0].name);
                        this.form.controls.tagCategoryId.patchValue(this.myModel.categories[0]._id);
                    }
                    if (this.modalData.isEdit && this.modalData.tagInfo.tagCategoryId) {
                        this.myControl.patchValue(this.modalData.tagInfo.tagCategoryId.name);
                        this.form.controls.tagCategoryId.patchValue(this.modalData.tagInfo.tagCategoryId._id);
                    }
                },
                () => {
                });
    }

    openAddCategory() {
        this.http.hideModal();
        if (this.form.value.name) {
            this.modalData.name = this.form.value.name;
        }
        if (this.form.value.description) {
            this.modalData.description = this.form.value.description;
        }
        this.http.showModal(AddTagCategoryComponent, 'md', this.modalData);
    }

    formInit() {
        this.form = this.http.fb.group({
            name: ['', Validators.required],
            tagCategoryId: [''],
            description: ['']
        });
        if (this.modalData.name) {
            this.form.controls.name.patchValue(this.modalData.name);
        }
        if (this.modalData.description) {
            this.form.controls.description.patchValue(this.modalData.description);
        }
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            this.http.hideModal();
            const obj: any = JSON.parse(JSON.stringify(this.form.value));
            if (this.modalData.isEdit) {
                obj.tagId = this.modalData.tagInfo._id;
            }
            this.http.postData(ApiUrl.ADD_TAG, obj).subscribe(() => {
                if (this.modalData.isEdit) {
                    this.http.openSnackBar('Tag Updated Successfully');
                } else {
                    this.http.openSnackBar('Tag Added Successfully');
                }
                this.http.eventSubject.next({eventType: 'addTag'});
                this.onClose ? this.onClose.next(true) : '';
            }, () => {
            });
        }
    }

    fillValues() {
        this.form.patchValue({
            name: this.modalData.tagInfo.name,
            description: this.modalData.tagInfo.description
        });
    }

    deleteTag() {
        const obj: any = {
            type: 5,
            id: this.modalData.tagInfo._id
        };
        this.http.hideModal();
        this.http.postData(ApiUrl.DELETE_DATA, obj).subscribe(() => {
            this.http.openSnackBar('Deleted Successfully');
            this.http.eventSubject.next({eventType: 'deleteTag'});
        });
    }

}
