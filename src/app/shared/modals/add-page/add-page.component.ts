import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-add-page',
    templateUrl: './add-page.component.html',
    styleUrls: ['./add-page.component.css']
})

export class AddPageComponent implements OnInit {

    viewPages = true;
    viewUploadFile = false;

    constructor(){

    }

    ngOnInit(): void {
    }

    clickPages(){
        this.viewPages = true;
        this.viewUploadFile = false;
    }

    clickUploadFile(){
        this.viewPages = false;
        this.viewUploadFile = true;
    }

  
}