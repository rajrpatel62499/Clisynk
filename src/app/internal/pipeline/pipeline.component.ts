import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {HttpService} from '../../services/http.service';
import {AddPipelineComponent} from '../../shared/modals/add-pipeline/add-pipeline.component';
import {TableModel} from '../../shared/models/table.common.model';
import {ApiUrl} from '../../services/apiUrls';
import {ManagePipelineComponent} from '../../shared/modals/manage-pipeline/manage-pipeline.component';
import {AutoConfigComponent} from '../../shared/modals/auto-config/auto-config.component';

@Component({
    selector: 'app-pipeline',
    templateUrl: './pipeline.component.html',
    styleUrls: ['./pipeline.component.scss']
})

export class PipelineComponent implements OnInit, OnDestroy {

    myModel: any;
    form: FormGroup;
    newStage = new FormControl();
    connectedTo = [];
    prevData: any = {};

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.myModel.selectedTab = 0;
        this.myModel.subscription = this.http.eventStatus.subscribe(data => {
            if (data && data.eventType) {
                switch (data.eventType) {
                    case 'addPipeline':
                        this.pipelineList(true);
                        break;
                    case 'managePipeline':
                        this.pipelineList();
                        break;
                    case 'addDeal':
                        this.stageList();
                        break;
                }
            }
        });
    }

    ngOnInit() {
        this.pipelineList();
    }

    ngOnDestroy(): void {
        this.myModel.subscription.unsubscribe();
    }

    openAddPipeline() {
        this.http.showModal(AddPipelineComponent, 'xs');
    }

    managePipeline() {
        const obj: any = {
            pipelines: this.myModel.pipelines
        };
        this.http.showModal(ManagePipelineComponent, 'md', JSON.parse(JSON.stringify(obj)));
    }

    pipelineList(isLast?) {
        this.http.getData(ApiUrl.PIPELINES, {}).subscribe(res => {
            this.myModel.pipelines = res.data;
            if (isLast) {
                this.myModel.selectedTab = res.data.length - 1;
            } else {
                this.myModel.selectedTab = 0;
            }
            this.stageList();
        });
    }

    stageList(loader?) {
        const obj: any = {
            pipelineId: this.myModel.pipelines[this.myModel.selectedTab]._id
        };
        this.myModel.loader = loader;
        this.http.getData(ApiUrl.PIPELINE_STAGES, obj).subscribe(res => {
            this.myModel.stages = [];
            this.myModel.stages = res.data;
            this.myModel.stages.forEach((val, key) => {
                val.total = 0;
                val.id = 'id-' + key;
                if (val.dealId) {
                    val.dealId.forEach((val1) => {
                        val.total = val.total + val1.dealValue;
                    });
                }
            });

            for (const week of this.myModel.stages) {
                this.connectedTo.push(week.id);
            }
            this.myModel.loader = false;
        });
    }

    openDealDetails(stage, deal) {
        const obj: any = {
            stage: stage,
            deal: deal
        };
        this.http.openModal('dealDetails', obj);
    }

    openConfig(stage, deal) {
        const obj: any = {
            stage: stage,
            deal: deal
        };
        this.http.openModal('dealDetails', obj);
    }

    deleteStage(index) {
        if (this.myModel.stages[index].dealId && this.myModel.stages[index].dealId.length) {
            this.http.openSnackBar('Please move deals to another stage');
            this.http.openModal('moveDeal', this.myModel.stages[index]);
        } else {
            this.http.postData(ApiUrl.DELETE_PIPELINE_STAGE, {stageId: this.myModel.stages[index]._id}).subscribe(() => {
                this.myModel.stages.splice(index, 1);
                this.http.openSnackBar('Stage Deleted');
            });
        }
    }

    addNewStage() {
        if (this.newStage.value) {
            const obj: any = {
                name: this.newStage.value,
                pipelineId: this.myModel.pipelines[this.myModel.selectedTab]._id
            };
            this.newStage.patchValue('');
            this.http.postData(ApiUrl.ADD_PIPELINE_STAGE, obj).subscribe(() => {
                this.stageList();
            });
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.myModel.stages, event.previousIndex, event.currentIndex);
        this.stageOrderChanged();
    }

    stageOrderChanged() {
        const tempArr: any = [];
        this.myModel.stages.forEach((val, key) => {
            tempArr.push({
                stageId: val._id,
                srNo: key + 1
            });
        });
        const obj: any = {
            data: JSON.stringify(tempArr)
        };
        this.http.postData(ApiUrl.REORDER_STAGE, obj).subscribe();
    }

    drop1(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            this.moveDealApi(event);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            this.moveDealApi(event);
        }
    }

    editStage(data) {
        data.isEdit = !data.isEdit;
        const obj: any = {
            stageId: data._id,
            name: data.name,
            pipelineId: this.myModel.pipelines[this.myModel.selectedTab]._id
        };
        this.http.postData(ApiUrl.ADD_PIPELINE_STAGE, obj).subscribe();
    }

    openAutoConfig(data) {
        this.http.showModal(AutoConfigComponent, 'md', data);
    }

    moveDealApi(event) {
        this.myModel.stages.forEach((val, key) => {
            if (val.id === event.previousContainer.id) {
                this.prevData = val;
            }
        });

        let myData: any = {};
        this.myModel.stages.forEach((val, key) => {
            if (val.id === event.container.id) {
                myData = val;
            }
        });
        const obj: any = {
            movedTo: myData._id,
            movedFrom: this.prevData._id,
            dealId: event.container.data[event.currentIndex]._id
        };
        this.http.postData(ApiUrl.MOVE_DEAL, obj).subscribe(res => {
            this.stageList(false);
        });
    }

}
