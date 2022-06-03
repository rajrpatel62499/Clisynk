import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-doc',
  templateUrl: './delete-doc.component.html'
})
export class DeleteDocComponent implements OnInit {

  modalData: any;
  public onClose: Subject<boolean>;
  url = "documents";


  constructor(public http: HttpService, private router: Router) {
  }

  ngOnInit(): void {
  }

  deleteDocs() {
    console.log("this.modalData==========",this.modalData);
    let url = 'documents/delete';
    let body = {
      "documentIds": this.modalData,
    };
    this.http.updateDocument(url, body).subscribe(() => {
      this.http.documentUpdated();
      this.http.openSnackBar('Deleted Successfully');
      this.http.getData(this.url, { partial: 1 }).subscribe((res) => {
        if (res.data && res.data.length) {
          this.http.documentUpdated(res.data);
        }
        this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/documents']);
        });
      });
      this.http.hideModal();
    }, () => {
    });

  }



}
