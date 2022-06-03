import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {Subject} from 'rxjs';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-add-pipeline-task',
    templateUrl: './add-pipeline-task.component.html'
})
export class AddPipelineTaskComponent implements OnInit {

    form: FormGroup;
    myModel: any;
    modalData: any;
    isEdit = false;
    public onClose: Subject<boolean>;
    assigns: any = [];

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.assigns = ['Primary Deal Contact'];
    }

    ngOnInit(): void {
        this.formInit();
        if (this.modalData.taskData) {
            this.isEdit = true;
            this.fillValues(this.modalData.taskData);
        }
    }

    finalSubmit() {

        if (!this.modalData.savedData.into) {
            this.modalData.into = [];
        } else { this.modalData.into = this.modalData.savedData.into; }


        if (!this.modalData.savedData.into) {
            this.modalData.outof = [];
        } else { this.modalData.outof = this.modalData.savedData.outof; }

        if (this.http.isFormValid(this.form)) {
            if (this.modalData.taskData && this.modalData.taskData.type) {

                if (this.modalData.selectedTab === 1) {
                    this.modalData.into[this.modalData.selectedIndex] = this.form.value;
                } else {
                    this.modalData.outof[this.modalData.selectedIndex] = this.form.value;
                }
            } else {
                if (this.modalData.selectedTab === 1) {
                    this.modalData.into.push(this.form.value);
                } else {
                    this.modalData.outof.push(this.form.value);
                }
            }
             this.apiHit();
        }
    }

    apiHit() {
        const obj: any = {
            pipelineId: this.modalData.pipelineId,
            stageId: this.modalData._id
        };
        obj.into = JSON.stringify(this.modalData.into || []);
        obj.outof = JSON.stringify(this.modalData.outof || []);

        if (this.modalData.allItems) {
            obj.automationId = this.modalData.allItems._id;
        }
        this.myModel.loader = true;
        this.http.postData(ApiUrl.CONFIGURE_AUTOMATION, obj).subscribe(() => {
            this.myModel.loader = false;
            this.modalData.automationConfigure = true;
            this.goBack();
        });
    }

    formInit() {
        this.form = this.http.fb.group({
            type: ['3'],
            note: [''],
            taskTitle: ['', Validators.required],
            days: [undefined, Validators.required],
            timeZone : [this.http.getTimeZone()],
            assignTask: ['Primary Deal Contact', Validators.required]
        });
    }

    goBack() {
        this.http.hideModal();
        this.http.openModal('autoConfig', this.modalData);
    }

    fillValues(data) {
        this.form.patchValue({
            assignTask: data.assignTask,
            days: data.days,
            taskTitle: data.taskTitle,
            type: data.type,
            note: data.note
        });
    }

}
