import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
    selector: 'app-create-folder',
    templateUrl: './create-folder.component.html',
    styleUrls: ['./create-folder.component.css']
})

export class CreateFolderComponent implements OnInit {
    myControl = new FormControl('');
    form: FormGroup;
    url = 'documents';
    modalData: any;
    title = 'Create Folder';
    button = 'Create';


    constructor(private fb: FormBuilder,
        private router: Router,
        public http: HttpService) {

    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [''],
        });
        if (this.modalData && this.modalData.title) {
            if (this.modalData['type'] == 'FILE') {
                this.title = 'Edit Documents';
            } else {
                this.title = 'Edit Folder';
            }

            this.button = 'Rename';
            this.form.patchValue({ 'name': this.modalData.title })
        }


    }

    finalSubmit() {
        this.http.hideModal();
        if (this.modalData && this.modalData.title) {
            const obj = {
                title: this.form.value.name
            };
            this.http.postData(this.url + '/' + this.modalData['_id'], obj).subscribe(res => {
                this.http.openSnackBar('Folder ' + this.form.value.name + ' Successfully Updated.');
                this.http.getData(this.url, { partial: 1 }).subscribe((res) => {
                    if (res.data && res.data.length) {
                        res.data.folderListCallback = true;
                        this.http.documentUpdated(res.data);
                    }
                });
            }, () => {
            });
        } else {
            const obj = {
                title: this.form.value.name,
                parent: (this.modalData.parentId ? this.modalData.parentId : ''),
                type: "FOLDER"
            };
            this.http.postData(this.url, obj).subscribe(res => {
                this.http.openSnackBar('Folder ' + this.form.value.name + ' Successfully Created');
                this.http.getData(this.url, { partial: 1 }).subscribe((res) => {
                    if (res.data && res.data.length) {
                        res.data.folderListCallback = true;
                        this.http.documentUpdated(res.data);
                    }
                });
            }, () => {
            });
        }
        
    }
}