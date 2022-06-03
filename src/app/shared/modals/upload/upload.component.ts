import { finalize } from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../../services/http.service';
import {Subject, Subscription} from 'rxjs';
import {ApiUrl} from '../../../services/apiUrls';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
})
export class UploadComponent implements OnInit {

    modalData: any;
    public onClose: Subject<boolean>;
    loading = false;
    subscription: Subscription;

    constructor(public http: HttpService) {
        // this.subscription = this.http.loaderStatus.subscribe(status => {
        //     this.loading = status;
        // });
    }

    ngOnInit(): void {
    }

    goBack() {
        this.http.hideModal();
        this.http.openModal('sendEmail', this.modalData);
    }

    uploadImage(files:any) {
        if (files.length > 1) {
            files = Array.prototype.slice.call(files);

            this.loading = true;
            this.http.uploadMultipleImages(ApiUrl.UPLOAD_IMAGE, files, true).pipe(finalize(()=> this.loading = false)).subscribe(res => {
                console.log(res);
                (res.data as []).forEach((file:any) => {
                    this.modalData.filesData.push({
                        original: file.original,
                        thumbnail: file.thumbnail,
                        ext: file.ext,
                        fileName: file.fileName
                    });
                })
                this.goBack();
            }, (err) => {
                console.log(err);
            });

        } else {
            files = files[0];
            this.loading = true;
            this.http.uploadImage(ApiUrl.UPLOAD_IMAGE, files, true).pipe(finalize(()=> this.loading = false)).subscribe(res => {
                this.modalData.filesData.push({
                    original: res.data.original,
                    thumbnail: res.data.thumbnail,
                    ext: res.data.ext,
                    fileName: res.data.fileName
                });
                this.goBack();
            }, (err) => {
                console.log(err);
            });
        }
        console.log(files);
       
    }

}
