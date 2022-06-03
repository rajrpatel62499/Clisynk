import {Component, OnInit, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {ContactFilterComponent} from '../contact-filter/contact-filter.component';
import {ApiUrl} from '../../../services/apiUrls';
import {AddContactComponent} from '../add-contact/add-contact.component';
import {AppointBookComponent} from '../appoint-book/appoint-book.component';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-placeholders',
    templateUrl: './placeholders.component.html',
    styleUrls: ['./placeholders.component.scss']
})
export class PlaceholdersComponent implements OnChanges {

    @Input() flag: number;
    @Input() data: any;
    @Output() returnAction: EventEmitter<any> = new EventEmitter();
    myData: any;
    selectedFlag: number;
    modalRef: any;
    isLoader: boolean = false;

    constructor(public http: HttpService) {
    }

    ngOnChanges(): void {
        this.myData = this.data;
        this.selectedFlag = this.flag;
    }

    openContactFilter() {
        this.http.showModal(ContactFilterComponent, 'md');
    }

    uploadImage(file) {
        this.isLoader = true;
        this.http.uploadImage(ApiUrl.UPLOAD_IMAGE, file, false).subscribe(res => {
            const obj: any = {
                contactId: this.data._id,
                name: file.name,
                original: res.data.original,
                thumbnail: res.data.thumbnail,
                size: this.http.formatBytes(file.size, 1)
            };
            this.http.postData(ApiUrl.ADD_FILES, obj).subscribe(() => {
                this.http.openSnackBar('Uploaded Successfully');
                this.returnAction.emit();
                this.isLoader = false
            }, () => {
            });
        }, () => {
        });
    }

    addClient() {
        this.http.showModal(AddContactComponent, 'md', {contactsType: 2});
    }

    addLead() {
        this.http.showModal(AddContactComponent, 'md', {contactsType: 1});
    }

    openBook() {
        this.modalRef = this.http.showModal(AppointBookComponent, 'md', this.myData);
        this.modalRef.content.onChange = new Subject<boolean>();
        this.modalRef.content.onChange.subscribe(res => {
            res ? this.modalRef.setClass('modal-more-lg') : this.modalRef.setClass('modal-md');
        });
    }

}
