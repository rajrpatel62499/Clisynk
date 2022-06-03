import {Component} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import {ConfirmComponent} from '../confirm/confirm.component';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-manage-pipeline',
    templateUrl: './manage-pipeline.component.html'
})
export class ManagePipelineComponent {

    form: FormGroup;
    myModel: any;
    modalData: any;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.formInit();
    }

    formInit() {
        this.form = this.http.fb.group({
            name: ['', Validators.required]
        });
    }

    onBlurSubmit(i) {
        if (this.modalData.pipelines[i].name) {
            const obj: any = {
                name: this.modalData.pipelines[i].name,
                pipeId: this.modalData.pipelines[i]._id
            };
            this.http.postData(ApiUrl.ADD_PIPELINE, obj).subscribe(res => {
            });
        }
    }

    finalClose() {
        this.http.eventSubject.next({eventType: 'managePipeline'});
        this.http.hideModal();
        this.http.openSnackBar('Saved Successfully');
    }

    deleteItem(i) {
        const obj: any = {
            title: `Delete Sales ${this.modalData.pipelines[i].name} pipeline?`,
            message: 'Are you sure you want to delete this pipeline?'
        };
        const modalRef = this.http.showModal(ConfirmComponent, 'xs', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.http.postData(ApiUrl.DELETE_PIPELINE, {pipelineId: this.modalData.pipelines[i]._id}).subscribe(() => {
                this.modalData.pipelines.splice(i, 1);
            });
        });
    }

}
