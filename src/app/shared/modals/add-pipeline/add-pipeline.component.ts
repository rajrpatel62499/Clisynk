import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-add-pipeline',
    templateUrl: './add-pipeline.component.html'
})
export class AddPipelineComponent implements OnInit {

    form: FormGroup;
    myModel: any;
    modalData: any;

    constructor(public http: HttpService
    ) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
    }

    formInit() {
        this.form = this.http.fb.group({
            name: ['', Validators.required]
        });
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            this.http.hideModal();
            this.http.postData(ApiUrl.ADD_PIPELINE, this.form.value).subscribe(res => {
                this.http.openSnackBar('Pipeline Added Successfully');
                this.http.eventSubject.next({eventType: 'addPipeline'});
            }, () => {
            });
        }
    }

}
