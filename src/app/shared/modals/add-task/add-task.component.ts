import { MB, KB } from './../../../services/constants';
import { finalize, takeUntil } from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {ApiUrl} from '../../../services/apiUrls';
import { Subject, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { UploadedFile } from '../../models/image-upload';

@Component({
    selector: 'app-add-task',
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

    form: FormGroup;
    allData;
    myModel: any;
    modalData: any;
    public onClose: Subject<boolean>;
    contacts: any = [];
    isSelected = false;
    isEditMode = false;
    today = new Date();
    loading = false;
    imageObj: UploadedFile = null;
    unsubAll = new Subject<boolean>();

    // get fromStartDate() {

    //     return new Date(obj.startDateTime).setHours(hh, mm)
    // }
    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnInit(): void {
        this.formInit();
        if (this.modalData) {
            if (this.modalData._id) {
                this.isEditMode = true;
            }
            this.fillValues();
        }
        console.log(this.modalData)
        // this.createSlots();
        this.contactList();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.unsubAll.next(true);
        this.unsubAll.complete();
    }

    deleteTask(template) {
        this.http.showModal(template, 'xs');
    }

    createSlots() {
        let slotTime = moment(this.isEditMode ? new Date(new Date(this.modalData.dueDateTime).setDate(new Date().getDate())) : new Date(), 'HH:mm a');
        const endTime = moment('24:00 pm', 'HH:mm a');
        let selectedIndex = 0;
        while (slotTime < endTime) {
            this.myModel.timeSlots.push(moment(slotTime));
            if (this.isEditMode) {
                if (moment(slotTime).format('hh:mm a') === moment(this.modalData.dueDateTime).format('hh:mm a')) {
                    this.form.controls.selectedSlot.patchValue(this.myModel.timeSlots[selectedIndex]);
                }
            } else {
                this.form.controls.selectedSlot.patchValue(this.myModel.timeSlots[0]);
            }
            slotTime = slotTime.add(15, 'minutes');
            selectedIndex++;
        }
    }

    finalSubmit() {
        const obj: any = JSON.parse(JSON.stringify(this.form.value));
        const hh: any = moment(this.form.value.selectedSlot).format('HH');
        const mm: any = moment(this.form.value.selectedSlot).format('mm');
        obj.dueDateTime = new Date(obj.dueDateTime).setHours(hh, mm);
        obj.startDateTime = new Date(obj.startDateTime).setHours(hh, mm);
        delete obj.selectedSlot;

        if (this.form.value.contactId.length) {
            obj.contactId = JSON.stringify(this.http.getIdsOnly(this.form.value.contactId));
        }

        if (this.isEditMode) {
            obj.taskId = this.modalData._id;
        }
        obj.timeZone = this.http.getTimeZone();
        if (this.http.isFormValid(this.form)) {
            this.myModel.loader = true;
            this.http.postData(ApiUrl.ADD_TASK, obj).subscribe(() => {
                this.http.hideModal();
                this.myModel.loader = false;
                this.isEditMode ? this.http.openSnackBar('Task Updated Successfully') : this.http.openSnackBar('Task Added Successfully');
                this.http.eventSubject.next({eventType: 'addTask'});
            }, () => {
                this.myModel.loader = false;
            });
        }
    }

    contactList(search?) {
        this.isSelected = false;
        const obj: any = {
            skip: 0,
            limit: 100,
            search: search ? search : ''
        };
        this.http.getData(ApiUrl.CONTACTS, obj).subscribe(res => {
                    res.data.data.forEach((val) => {
                        this.http.checkLastName(val);
                        if (val.email) {
                            val.showName = val.showName + ` (${val.email})`;
                        }
                        if (this.isEditMode) {
                            if (this.modalData.contactId && this.modalData.contactId._id === val._id) {
                                this.form.controls.contactId.patchValue([val]);
                            }
                        }
                    });
                    this.contacts = res.data.data;
                },
                () => {
                });
    }

    formInit() {
        this.form = this.http.fb.group({
            contactId: ['', Validators.required],
            note: [''],
            title: ['', Validators.required],
            dueDateTime: [new Date(), Validators.required],
            reminderType: [''],
            // selectedSlot: ['', Validators.required], REMOVED.
            
            /** New Added */
            startDateTime: [new Date(), Validators.required],
            image: [''],
            priority: ['']
            
        });
        this.form.get('startDateTime').valueChanges.subscribe(val => {
            this.form.get('dueDateTime').setValue(val);
        })
    }

    fillValues() {
        this.form.patchValue({
            title: this.modalData.title,
            note: this.modalData.note,
            reminderType: this.modalData.reminderType,
        });
        if (this.modalData.dueDateTime) {
            this.form.controls.dueDateTime.patchValue(new Date(this.modalData.dueDateTime));
        }
        if (this.modalData.startDateTime) {
            this.form.controls.startDateTime.patchValue(new Date(this.modalData.startDateTime));
        }
        if (this.modalData.priority) {
            this.form.controls.priority.patchValue(this.modalData.priority);
        }
        if (this.modalData.image) {
            this.imageObj = JSON.parse(this.modalData.image);
            this.form.controls.image.patchValue(this.modalData.image);
        }
    }

    changeStatus(status) {
        const obj = {
            status: status,
            taskId: this.modalData._id
        };
        this.http.hideModal();
        this.http.getData(ApiUrl.UPDATE_TASK, obj).subscribe(() => {
            if (status === 2) {
                this.http.openSnackBar('Task Completed Successfully');
            } else {
                this.http.openSnackBar('Task Deleted Successfully');
            }
            this.http.eventSubject.next({eventType: 'addTask'});
        });
    }

    uploadImage(file) {
        if (!this.http.isValidateFileTypeAndSize(file,'image', 20 * KB)) return;
        
        this.loading = true;
        this.http.uploadImage(ApiUrl.UPLOAD_IMAGE, file, false).pipe(finalize(()=>{this.loading=false;})).subscribe(res => {
            this.imageObj = res.data;
            this.form.controls.image.patchValue(JSON.stringify(this.imageObj));
        });
    }

    

}
