import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import { HttpService } from '../../../services/http.service';

@Component({
    selector: 'app-create-document',
    templateUrl: './create-document.component.html',
    // styleUrls: ['./create-document.component.css']
})

export class CreateDocumentComponent implements OnInit {

    myControl = new FormControl('');
    form: FormGroup;
    tab = 'mytemplates';
    url = 'documents';
    modalData: any;
    selected: any;

    constructor(private fb: FormBuilder,
        private router: Router,
        public http: HttpService){

    }

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [''],
        });
    }

    finalSubmit(){

    }

    addDocument() {
        this.http.hideModal();
        
    }

    createDocument(){
        this.http.hideModal();
        const obj = {
            title:"New Document",
            parent: (this.modalData.parentId ? this.modalData.parentId  : ""),
            type:"FILE",
        };
        this.http.postData(this.url, obj).subscribe(res => {
            this.router.navigate(['/documents/approve-doc/'+res.data._id]);
        }, () => {
        });
    }
}