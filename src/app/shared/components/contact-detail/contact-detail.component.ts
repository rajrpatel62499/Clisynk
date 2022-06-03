import { FileExt, MB } from './../../../services/constants';
import {Component, Input, OnChanges, Output, EventEmitter, OnDestroy} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ApiUrl} from '../../../services/apiUrls';
import {TableModel} from '../../models/table.common.model';
import {SendEmailComponent} from '../../modals/send-email/send-email.component';
import {Subject} from 'rxjs';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {DeleteComponent} from '../../modals/delete/delete.component';
import * as _ from 'lodash';
import {detailsOptions, emailOptions, titles, EMAIL_REGEX} from '../../../services/constants';
import {AppointBookComponent} from '../../modals/appoint-book/appoint-book.component';

@Component({
    selector: 'app-contact-detail',
    templateUrl: './contact-detail.component.html',
    styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnChanges, OnDestroy {

    modalRef: any;
    form: FormGroup;
    @Input() myData: any;
    selected: any;
    activeIcon = 1;
    activityLoader = true;
    myModel: any;
    @Output() closeBtn: EventEmitter<any> = new EventEmitter();
    isEdit = false;
    moreSection = '';
    contactsType = new FormControl('');
    tagsSearch = new FormControl('');
    fileSearch = new FormControl('');
    detailsOptions = detailsOptions;
    emailOptions = emailOptions;
    titles = titles;
    item: [];
    nextData: any = '';
    isLoader = false;
    billingAddress: any = {
        address: '', lat: undefined, long: undefined, other: '', country: '', state: '', zipCode: '', city: ''
    };

    allowedExt = [
        FileExt.JPEG, FileExt.JPEG, FileExt.PDF, FileExt.XLS, FileExt.DOC, FileExt.PNG
    ]

    get multiPhoneNumber(): FormArray {
        return this.form.get('multiPhoneNumber') as FormArray;
    }

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
        this.formInit();
        this.myModel.subscription = this.http.eventStatus.subscribe(data => {
            if (data && data.eventType) {
                this.getDetails();
            }
        });
    }

    ngOnDestroy() {
        this.myModel.subscription.unsubscribe();
    }

    ngOnChanges() {
        this.selected = this.myData;
        if (this.selected.eventType === 'taskList') {
            this.moreSection = 'tasks';
            this.activeIcon = 6;
            this.selected = this.selected.data;
            this.contactDetails();
            this.getDetails();
        } else {
            if (this.myData.contactsType) {
                this.contactsType.patchValue(this.myData.contactsType.toString());
            }
            this.getDetails();
        }

    }

    uploadImage(file) {
        if (!this.http.isValidFileType(file,this.allowedExt)) return;
        if (!this.http.isValidFileSize(file, 10 * MB)) return;

        if (file) {
            this.isLoader = true;
            this.http.uploadImage(ApiUrl.UPLOAD_IMAGE, file, false).subscribe(res => {
                const obj: any = {
                    contactId: this.selected._id,
                    name: file.name,
                    original: res.data.original,
                    thumbnail: res.data.thumbnail,
                    size: this.http.formatBytes(file.size, 1)
                };
                this.http.postData(ApiUrl.ADD_FILES, obj).subscribe(() => {
                    this.http.openSnackBar('Uploaded Successfully');
                    this.getDetails();
                    this.isLoader = false;
                }, () => {
                });
            }, () => {
            });
        }
    }

    formInit() {
        this.form = this.http.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            company: [''],
            jobTitle: [''],
            countryCode: ['+91'],
            multiPhoneNumber: this.http.fb.array([])
        });
    }

    removeEmail(type) {
        this.form.removeControl(type);
        switch (type) {
            case 'email':
                this.emailOptions.push({name: 'Work email', id: 'email'});
                break;
            case 'personalEmail':
                this.emailOptions.push({name: 'Personal email', id: 'personalEmail'});
                break;
            case 'otherEmail':
                this.emailOptions.push({name: 'Other email', id: 'otherEmail'});
                break;
        }
    }

    createItem(): FormGroup {
        return this.http.fb.group({
            phoneNumber: [''],
            type: ['work']
        });
    }

    addPhoneItem(): void {
        this.multiPhoneNumber.push(this.createItem());
    }

    fillValues() {
        this.form = null;
        this.formInit();
        this.form.reset({});
        const selected = JSON.parse(JSON.stringify(this.selected));
        this.form.patchValue({
            firstName: selected.firstName,
            lastName: selected.lastName,
            countryCode: selected.countryCode,
            phoneNumber: selected.phoneNumber,
            company: selected.company,
            jobTitle: selected.jobTitle,
            email: selected.email,
            otherEmail: selected.otherEmail,
            personalEmail: selected.personalEmail,
        });

        if (selected.multiPhoneNumber.length) {
            while (this.multiPhoneNumber.length !== 0) {
                this.multiPhoneNumber.removeAt(0);
            }
        }

        if (selected.multiPhoneNumber.length) {
            selected.multiPhoneNumber.forEach((item: any) => {
                const formGroup: FormGroup = this.createItem();
                formGroup.get('phoneNumber').patchValue(item.phoneNumber);
                formGroup.get('type').patchValue(item.type);
                this.multiPhoneNumber.push(formGroup);
            });
        }

        if (selected.email) {
            this.addFields(this.emailOptions, 'email', selected.email);
        }
        if (selected.personalEmail) {
            this.addFields(this.emailOptions, 'personalEmail', selected.personalEmail);
        }
        if (selected.otherEmail) {
            this.addFields(this.emailOptions, 'otherEmail', selected.otherEmail);
        }
        // if (selected.middleName) {
            this.addFields(this.detailsOptions, 'middleName', selected.middleName);
        // }
        // if (selected.suffix) {
            this.addFields(this.detailsOptions, 'suffix', selected.suffix);
        // }
        // if (selected.title) {
            this.addFields(this.detailsOptions, 'title', selected.title);
        // }

    }

    patternCheck(data) {
        const res = this.form.controls[data].value.match(EMAIL_REGEX);
        if (data === 'email') {
            if (!res) {
                this.http.openSnackBar('Please enter valid email');
            }
        } else if (data === 'otherEmail') {
            if (!res) {
                this.http.openSnackBar('Please enter valid other email');
            }
        } else {
            if (!res) {
                this.http.openSnackBar('Please enter valid personal email');
            }
        }
    }

    addFields(arr, key, val) {
        arr.forEach((val1, i) => {
            if (val1.id === key) {
                arr.splice(i, 1);
            }
        });
        this.form.addControl(key, new FormControl(val));
    }

    clickOption(arr, index) {
        this.form.addControl(arr[index].id, new FormControl(''));
        arr.splice(index, 1);
    }

    contactDetails() {
        this.http.getData(ApiUrl.CONTACT_DETAILS, {contactId: this.selected._id}).subscribe(res => {
            // .removeAt(i)
            this.http.emptyFormArr(this.multiPhoneNumber);
            this.selected = res.data.detail;
            this.contactsType.patchValue(this.selected.contactsType.toString());
            if (this.selected.billingAddress) {
                this.billingAddress = this.selected.billingAddress;
                this.countryList(this.billingAddress.country);
            }
        });
    }

    editContact() {
        if (this.http.isFormValid(this.form)) {
            const obj: any = JSON.parse(JSON.stringify(this.form.value));
            obj.contactId = this.selected._id;
            obj.multiPhoneNumber = JSON.stringify(obj.multiPhoneNumber);
            Object.keys(this.billingAddress).forEach(key => {
                if (obj[key] === '' && obj[key] === undefined) {
                    delete obj[key];
                }
            });
            obj.billingAddress = JSON.stringify(this.billingAddress);
            this.http.postData(ApiUrl.ADD_CONTACT, obj).subscribe((res) => {
                this.isEdit = false;
                this.http.contactUpdated();
                this.getDetails();
                this.selected = res.data;
                this.http.contactUpdated(res);
                this.http.openSnackBar('Updated Successfully');
            }, () => {
            });
        }
    }

    closeFun() {
        this.closeBtn.emit();
    }

    openEmailModal() {
        this.http.showModal(SendEmailComponent, 'md', this.selected);
    }

    onTypeChange(val) {
        this.contactsType.setValue(val);
        console.log(val);
        const obj: any = {
            contactId: this.selected._id,
            contactsType: val
        };
        this.http.postData(ApiUrl.ADD_CONTACT, obj).subscribe(() => {
            this.http.contactUpdated(obj);
        }, () => {
        });
    }

    getDetails() {
        this.isEdit = false;
        this.activityLoader = true;
        switch (this.activeIcon) {
            case 1:
                this.activityDetails();
                break;
            case 2:
                this.contactDetails();
                this.countryList();
                break;
            case 3:
                this.emailDetails();
                break;
            case 4:
                this.appointList();
                this.appointTypeList();
                break;
            case 5:
                this.moneyList();
                this.moneyList(1);
                this.moneyList(2);
                break;
            case 6:
                if (this.moreSection === 'files') {
                    this.fileList();
                } else if (this.moreSection === 'tasks') {
                    this.taskList();
                } else if (this.moreSection === 'tags') {
                    this.contactTagList(true);
                } else {
                    this.notesDetails();
                }
                break;
        }
    }

    appointList() {
        this.http.getData(ApiUrl.APPOINTMENTS, {contactId: this.selected._id}).subscribe(res => {
            this.myModel.appointments = res.data;
        });
    }

    appointTypeList() {
        this.http.getData(ApiUrl.APPOINTMENT_LIST_TYPES, {}).subscribe(res => {
            this.myModel.appointTypes = res.data;
        });
    }

    emailDetails() {
        this.http.getData(ApiUrl.EMAIL_HISTORY, {contactId: this.selected._id}).subscribe(res => {
            this.myModel.emails = res.data;
            this.activityLoader = false;
        }, () => {
            this.activityLoader = false;
        });
    }

    activityDetails() {
        this.http.getData(ApiUrl.ACTIVITY_LIST, {contactId: this.selected._id}).subscribe(res => {
            this.myModel.activities = res.data.data;
            this.myModel.dealData = res.data.dealData;
            this.activityLoader = false;
            this.pipelineList();
        }, () => {
            this.activityLoader = false;
        });
    }

    notesDetails() {
        this.http.getData(ApiUrl.NOTES, {contactId: this.selected._id}).subscribe(res => {
            this.myModel.notes = res.data;
            this.activityLoader = false;
        }, () => {
            this.activityLoader = false;
        });
    }

    taskList() {
        const obj: any = {
            limit: 100,
            skip: 0,
            contactId: this.selected._id,
            status: this.myModel.status
        };
        this.http.getData(ApiUrl.TASK_LIST, obj).subscribe(res => {
            this.myModel.tasks = res.data.data;
            this.activityLoader = false;
            console.log("contact details task list=>", this.myModel.tasks)
        }, () => {
            this.activityLoader = false;
        });
    }

    tagList() {
        const obj: any = {};
        this.http.getData(ApiUrl.TAGS, obj).subscribe(res => {
                this.myModel.tags = res.data.data;
                this.myModel.contactTags.data.map((obj) => {
                    let index = this.myModel.tags.findIndex(o => o._id === obj._id);
                    if (index > -1) {
                        this.myModel.tags.splice(index, 1);
                    }
                });

            },
            () => {
            });
    }

    applyTagToContact() {
        if (this.item && this.item.length) {
            const obj: any = {
                contactId: JSON.stringify([this.selected._id]),
                tagIds: JSON.stringify(this.http.getIdsOnly(this.item))
            };
            this.http.postData(ApiUrl.ADD_TAG_TO_CONTACT, obj).subscribe(() => {
                this.item = [];
                this.contactTagList(false);
                this.http.openSnackBar('Added Successfully');
            }, () => {
            });
        }
    }

    contactTagList(loader?) {
        this.activityLoader = loader;
        const obj: any = {
            contactId: this.selected._id,
            search: this.tagsSearch.value
        };
        this.http.getData(ApiUrl.CONTACT_TAGS, obj).subscribe(res => {
                this.myModel.contactTags = res.data;
                this.activityLoader = false;
                this.tagList();
            },
            () => {
                this.activityLoader = false;
            });
    }

    addressDetails(e) {
        if (e) {
            this.billingAddress.lat = e.lat;
            this.billingAddress.long = e.lng;
            this.billingAddress.zipCode = e.postal_code;
            this.billingAddress.city = e.city;
            this.billingAddress.address = e.formatted_address;
        } else {
            this.billingAddress.lat = undefined;
            this.billingAddress.long = undefined;
        }
    }

    countryList(country?) {
        const obj: any = {};
        if (country) {
            obj.country = country;
        }
        this.http.getData(ApiUrl.COUNTRY_STATE, obj).subscribe(res => {
                if (country) {
                    this.myModel.states = res.data;
                } else {
                    this.myModel.countries = res.data;
                }
            },
            () => {
            });
    }

    removeTag(data, index) {
        const obj = {
            contactId: JSON.stringify([this.selected._id]),
            tagId: data._id
        };
        this.myModel.contactTags.count--;
        this.myModel.contactTags.data.splice(index, 1);
        this.http.postData(ApiUrl.REMOVE_TAG_FROM_CONTACT, obj).subscribe(() => {
            this.http.openSnackBar('Tag successfully removed');
        }, () => {
        });
    }

    moneyList(type?) {
        this.activityLoader = true;
        const obj: any = {
            contactId: this.selected._id
        };
        if (type === 1) {
            obj.type = 1;
        } else if (type === 2) {
            obj.type = 2;
        }
        if (type) {
            this.http.getData(ApiUrl.QUOTES_LIST, obj).subscribe((res) => {
                if (type === 1) {
                    this.myModel.invoices = res.data.data;
                    this.activityLoader = false;
                } else if (type === 2) {
                    this.myModel.quotes = res.data.data;
                    this.activityLoader = false;
                }
            });
        } else {
            this.http.getData(ApiUrl.PAYMENT_LIST, obj).subscribe(res => {
                this.myModel.payments = res.data;
                this.activityLoader = false;
            }, () => {
            });
        }
    }

    fileList() {
        const obj: any = {
            limit: 100,
            skip: 0,
            contactId: this.selected._id
        };
        this.http.getData(ApiUrl.LIST_FILES, obj).subscribe(res => {
            this.myModel.files = res.data;
        });
    }

    deleteFun() {
        const obj: any = {
            type: 2,
            key: 'contactIds',
            message: 'Are you sure you want to delete this contact?',
            id: JSON.stringify([this.selected._id])
        };
        const modalRef = this.http.showModal(DeleteComponent, 'sm', obj);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(() => {
            this.closeFun();
        });
    }

    pipelineList() {
        this.http.getData(ApiUrl.PIPELINES, {}).subscribe(res => {
            this.myModel.pipelines = res.data;
            this.checkNext();
        });
    }

    checkNext() {
        this.myModel.dealData.forEach((val1) => {
            if (this.myModel.pipelines) {
                this.myModel.pipelines.forEach(val => {
                    if (val._id === val1.pipelineId._id) {
                        if (val.stages.length > 1) {
                            const myIndex = _.findIndex(val.stages, function (o: any) {
                                return o._id === val1.stageId._id;
                            });
                            if (myIndex >= 0) {
                                if (myIndex < val.stages.length) {
                                    val1.nextData = val.stages[myIndex + 1];
                                } else {
                                    val1.nextData = null;
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    optionSelected(newData, oldData) {
        const obj: any = {
            pipelineId: newData.selectedPipe._id,
            movedTo: newData.selectedStage._id,
            movedFrom: oldData.stageId._id,
            dealId: oldData._id
        };
        this.moveDealApi(obj);
    }

    moveToNext(data) {
        const obj: any = {
            pipelineId: data.pipelineId._id,
            movedTo: data.nextData._id,
            movedFrom: data.stageId._id,
            dealId: data._id
        };
        data.stageId = data.nextData;
        this.moveDealApi(obj);
    }

    moveDealApi(obj) {
        this.http.postData(ApiUrl.MOVE_DEAL, obj).subscribe(() => {
            this.http.openSnackBar('Moved Successfully');
            this.getDetails();
        });
    }

    checkLink(url, flag?) {
        if (this.http.checkAcl(url)) {
            switch (url) {
                case 'appointments':
                    this.activeIcon = 4;
                    this.getDetails();
                    break;
                case 'money':
                    this.activeIcon = 5;
                    this.getDetails();
                    break;
                case 'tasks':
                    this.moreSection = 'tasks';
                    this.getDetails();
                    break;
            }
        }
    }

    openBook() {
        this.modalRef = this.http.showModal(AppointBookComponent, 'md', this.selected);
        this.modalRef.content.onChange = new Subject<boolean>();
        this.modalRef.content.onChange.subscribe(res => {
            res ? this.modalRef.setClass('modal-more-lg') : this.modalRef.setClass('modal-md');
        });
    }

}
