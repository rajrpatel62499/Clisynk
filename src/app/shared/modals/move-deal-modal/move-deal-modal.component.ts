import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-move-deal-modal',
    templateUrl: './move-deal-modal.component.html'
})
export class MoveDealModalComponent implements OnInit {

    myModel: any;
    modalData: any;
    form: FormGroup;
    stages: any = [];
    selectedStage: any = {};
    dropdown: boolean;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        this.pipelineList();
    }

    formInit() {
        this.form = this.http.fb.group({
            text: ['', Validators.required]
        });
    }

    finalSubmit() {
        if (this.http.isFormValid(this.form)) {
            this.http.hideModal();
            this.http.postData(ApiUrl.ADD_EDIT_NOTES, this.form.value).subscribe(() => {
                this.http.contactUpdated();
                this.http.openSnackBar('Note Added Successfully');
            });
        }
    }

    finalDelete() {

        if (this.selectedStage._id) {
            const obj: any = {
                stageId: this.modalData._id,
                movePipelineId: this.stages._id,
                moveStageId: this.selectedStage._id
            };
            this.http.hideModal();
            this.http.postData(ApiUrl.DELETE_PIPELINE_STAGE, obj).subscribe(() => {
                this.http.eventSubject.next({eventType: 'addDeal'});
                this.http.openSnackBar('Stage Deleted');
            });
        }
    }

    pipelineList() {
        this.http.getData(ApiUrl.PIPELINES, {}).subscribe(res => {
            this.myModel.pipelines = res.data;
        });
    }

    selectPipe(val) {
        this.selectedStage = {};
        this.stages = val;
        document.getElementById('myId').click();
    }

    selectOption(data) {
        this.selectedStage = data;
    }

}
