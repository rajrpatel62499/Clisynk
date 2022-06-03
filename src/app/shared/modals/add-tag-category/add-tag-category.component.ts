import {Component} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-add-tag-category',
    templateUrl: './add-tag-category.component.html'
})
export class AddTagCategoryComponent {

    form: FormGroup;
    modalData: any;
    loader = false;

    constructor(public http: HttpService) {
        this.formInit();
    }

    formInit() {
        this.form = this.http.fb.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    goBack() {
        this.http.hideModal();
        this.modalData.newTagCategoryAdded = true;
        this.http.openModal('addTag', this.modalData);
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            this.loader = true;
            this.http.postData(ApiUrl.ADD_TAG_CATEGORY, this.form.value).subscribe(() => {
                this.http.hideModal();
                this.http.openSnackBar('Tag Category Added Successfully');
                this.modalData.newTagCategoryAdded = true;
                this.http.openModal('addTag', this.modalData);
                
                this.loader = false;
            }, () => {
                this.loader = false;
            });
        }
    }

}
