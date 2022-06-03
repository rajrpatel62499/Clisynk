import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {TableModel} from '../../models/table.common.model';
import {FormControl} from '@angular/forms';
import {ApiUrl} from '../../../services/apiUrls';
import {EditNoteComponent} from '../edit-note/edit-note.component';
import {Subject} from 'rxjs';
import { AddTaskComponent } from '../add-task/add-task.component';
import { AddNoteComponent } from '../add-note/add-note.component';

@Component({
    selector: 'app-note-list',
    templateUrl: './note-list.component.html',
    styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnChanges {

    @Input() allData: any;
    @Input() contactId: string;
    myModel: any;
    @Output() finalSubmit: EventEmitter<any> = new EventEmitter();
    text = new FormControl('');

    constructor(public http: HttpService) {
        this.myModel = new TableModel();
    }

    ngOnChanges() {
    }

    addNoteFun() {
        if (this.text.value.trim()) {
            const obj = {
                contactId: this.contactId,
                text: this.text.value
            };
            this.text.reset();
            this.http.postData(ApiUrl.ADD_EDIT_NOTES, obj).subscribe(() => {
                this.finalSubmit.emit();
                this.http.openSnackBar('Note Added Successfully');
            }, () => {
            });
        }
    }

    openEditNote(data) {
        const modalRef = this.http.showModal(EditNoteComponent, 'md', data);
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(res => {
            this.finalSubmit.emit();
        });
    }

    addNotemain(){
        let data = {contactId: this.contactId}
        const modalRef = this.http.showModal(AddNoteComponent, 'md',data );
        modalRef.content.onClose = new Subject<boolean>();
        modalRef.content.onClose.subscribe(res => {
            this.finalSubmit.emit();
        });
    }

}
