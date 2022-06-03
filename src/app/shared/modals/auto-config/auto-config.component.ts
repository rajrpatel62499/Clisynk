import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { TableModel } from '../../models/table.common.model';
import { FormControl } from '@angular/forms';
import { ApiUrl } from '../../../services/apiUrls';
import { PipelineSendEmailComponent } from '../pipeline-send-email/pipeline-send-email.component';
import { Subject } from 'rxjs';
import { CancelConfirmComponent } from '../cancel-confirm/cancel-confirm.component';
import { TagInputComponent, TagInputDropdown } from 'ngx-chips';

// declare const $: any;

@Component({
    selector: 'app-auto-config',
    templateUrl: './auto-config.component.html'
})
export class AutoConfigComponent implements OnInit {

    @ViewChild(TagInputComponent, { static: false })
    tagInput: TagInputComponent;
    @ViewChild(TagInputDropdown, { static: false })
    tagInputDropdown: TagInputDropdown;

    @HostListener('click')
    onClick() {
        if (!!this.tagInput && !this.tagInput.isInputFocused() && this.tagInputDropdown.isVisible) {
            this.tagInputDropdown.hide();
        }
    }

    modalData: any;
    myModel: TableModel;
    type = new FormControl('');
    savedData: any = {};

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.myModel.selectedTab = 1;

        // $(document).ready(function () {
        // $('body').click(function () {
        //     $('.ng2-dropdown-menu').addClass('display-none');
        // });
        // });
    }

    ngOnInit(): void {
        if (this.modalData.automationConfigure) {
            this.fillValues();
        }
        this.tagList();
    }

    fillValues() {
        const obj: any = {
            pipelineId: this.modalData.pipelineId,
            stageId: this.modalData._id
        };
        this.http.getData(ApiUrl.STAGE_AUTOMATION_DETAILS, obj).subscribe(res => {
            this.setArrowName(res.data.into);
            this.setArrowName(res.data.outof);
            this.savedData = res.data;
        });
    }

    setArrowName(arr) {
        if (arr) {
            arr.forEach((val) => {
                if (val.type === '1' || val.type === '2') {
                    val.tagId.forEach((val1) => {
                        let showName = '';
                        if (val1.tagCategoryId) {
                            showName = val1.tagCategoryId.name + ' -> ' + val1.name;
                        } else {
                            showName = val1.name;
                        }
                        val1.showName = showName;
                        val1.display = showName;
                        val1.value = val1._id;
                    });
                }
            });
            return arr;
        } else {
            return [];
        }
    }

    actionChanged() {
        switch (this.type.value) {
            case '1':
                this.addTagToshowItems('1');
                break;
            case '2':
                this.addTagToshowItems('2');
                break;
            case '3':
                this.openEditTask();
                break;
            case '4':
                this.openEmailModal();
                break;
        }
    }

    addTagToshowItems(flag) {
        const obj: any = {
            type: flag,
            tagId: []
        };
        if (this.myModel.selectedTab === 1) {
            if (!this.savedData.into) {
                this.savedData.into = [];
            }

            this.savedData.into.push(obj);
        } else {
            if (!this.savedData.outof) {
                this.savedData.outof = [];
            }
            this.savedData.outof.push(obj);
        }
    }

    finalSubmit(final?) {
        const obj: any = {
            pipelineId: this.modalData.pipelineId,
            stageId: this.modalData._id
        };
        if (!this.modalData.into) {
            this.modalData.into = [];
        }
        if (!this.modalData.outof) {
            this.modalData.outof = [];
        }

        console.log('saved data in finl' , this.savedData)

        const into: any = [];
        const outof: any = [];

        if (this.savedData.into) {
            this.savedData.into.forEach((val) => {
                if (val.type === '1' || val.type === '2') {
                    into.push({
                        tagId: this.http.getIdsOnly(val.tagId),
                        type: val.type
                    });
                } else {
                    into.push(val);
                }
            });
        }

        if (this.savedData.outof) {
            this.savedData.outof.forEach((val) => {
                if (val.type === '1' || val.type === '2') {
                    outof.push({
                        tagId: this.http.getIdsOnly(val.tagId),
                        type: val.type
                    });
                } else {
                    outof.push(val);
                }
            });
        }

        obj.into = JSON.stringify(into);
        obj.outof = JSON.stringify(outof);

        if (this.savedData) {
            obj.automationId = this.savedData._id;
        }
        if (final) {
            this.myModel.loader = true;
        }
        this.http.postData(ApiUrl.CONFIGURE_AUTOMATION, obj).subscribe(() => {
            if (final) {
                this.http.hideModal();
                this.http.eventSubject.next({ eventType: 'addDeal' });
            }
            this.myModel.loader = false;
        });
    }

    deleteItem(index) {
        if (this.myModel.selectedTab === 1) {
            this.savedData.into.splice(index, 1);
        } else {
            this.savedData.outof.splice(index, 1);
        }
        this.finalSubmit();
    }

    openEditTask(data?, index?) {
        this.http.hideModal();
        this.modalData.selectedTab = this.myModel.selectedTab;
        this.modalData.taskData = data;
        this.modalData.savedData = this.savedData;
        this.modalData.selectedIndex = index;
        this.http.openModal('addPipelineTask', this.modalData);
    }

    openEmailModal(data?, index?) {
        this.http.hideModal();
        this.modalData.selectedTab = this.myModel.selectedTab;
        this.modalData.emailData = data;
        this.modalData.savedData = this.savedData;
        this.modalData.selectedIndex = index;
        this.http.showModal(PipelineSendEmailComponent, 'md', this.modalData);
    }

    tagList() {
        const obj: any = {};
        this.http.getData(ApiUrl.TAGS, obj).subscribe(res => {
            this.myModel.tags = res.data.data;
            this.myModel.tags.forEach((val) => {
                let showName: any;
                if (val.tagCategoryId) {
                    showName = val.tagCategoryId.name + ' -> ' + val.name;
                } else {
                    showName = val.name;
                }
                val.showName = showName;
            });
        });
    }

    openConfirmModal() {
        const modalRef = this.http.showModal(CancelConfirmComponent, 'xs');
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.http.hideModal();
        });
    }

}
