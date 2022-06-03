import { HttpService } from 'src/app/services/http.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiUrl } from 'src/app/services/apiUrls';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-save-template',
  templateUrl: './save-template.component.html',
  styleUrls: ['./save-template.component.scss']
})
export class SaveTemplateComponent implements OnInit {

  public modalData: { html: string};
  public onClose: Subject<boolean>;
  public templateName: string = '';
  public loader = false;
  constructor(public http: HttpService) { }

  ngOnInit() {
  }

  close(data) {
    this.http.hideModal();
    this.onClose.next(data);
  }
  
  saveTemplate() {
    if (this.http.isNullOrEmpty(this.templateName)) return;

    let obj: any = {};
    obj.templateId = undefined;
    obj.name = this.templateName;
    obj.html = this.modalData.html;
    obj.subject = this.templateName;
    console.log({obj: obj});
    this.loader = true;
    this.http.postData(ApiUrl.ADD_EMAIL_TEMPLATE, obj).pipe(finalize(() => {this.loader = false;})).subscribe((res) => {
        this.http.openSnackBar("Template saved successfully");
        this.close(res.data);
    });
   
  }
}
