import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';

@Component({
    selector: 'app-contact-pipeline',
    templateUrl: './contact-pipeline.component.html'
})
export class ContactPipelineComponent implements OnChanges {

    myModel: any;
    stages: any = [];
    selectedStage: any = {};
    selectedPipe: any = {};
    @Output() selectedData: EventEmitter<any> = new EventEmitter();
    @Input() pipelines: any;
    showPipelines: any = [];
    isShowPipeline = false;

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnChanges(): void {
        this.showPipelines = [];
        if (this.pipelines) {
            this.pipelines.forEach((val) => {
                if (val.stages.length) {
                    this.showPipelines.push(val);
                }
            });
            this.isShowPipeline = true;
        }
    }

    selectPipe(val) {
        this.selectedPipe = val;
        this.selectedStage = {};
        this.stages = val;
        document.getElementById('myId').click();
    }

    selectOption(data) {
        this.selectedStage = data;
        const selectVal = {
            selectedPipe: this.selectedPipe,
            selectedStage: this.selectedStage
        };
        this.selectedData.emit(selectVal);
    }

    onClickedOutside(e) {
        if (e) {
            e = false;
            // document.getElementById('myId').click();
        }
    }

}
