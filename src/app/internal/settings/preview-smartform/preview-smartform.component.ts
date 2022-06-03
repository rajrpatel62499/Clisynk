import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-preview-smartform',
  templateUrl: './preview-smartform.component.html',
  styleUrls: ['./preview-smartform.component.css']
})
export class PreviewSmartformComponent implements OnInit {

  constructor(public http: HttpService, public route: ActivatedRoute) { }

  loader = false;
  formData = new FormData();
  
  public form: Object = {};
  formName: string;
  submitted = false;

  ngOnInit() {
    this.getForm();
  }

  getForm(){
    this.loader = true; 
    this.http.getLeadFormById(this.route.snapshot.paramMap.get('id')).subscribe(res => {  
    console.log(res);
    if(Array.isArray(res.data.formJson.components) && res.data.formJson.components.length){
        this.formData.append("smartFormId", res.data._id);
        this.form = res.data.formJson;
        this.formName = res.data.name
        this.loader = false;
    }
    }, () => {
        this.loader = false;
    });
  }


  onSubmit(event){
    console.log(event);
    this.formData.append("resultJson", JSON.stringify(event.data));
    this.http.postLeadForm(this.formData).subscribe(res => {
      console.log(res);
      if(res['statusCode'] == 200){
        this.submitted = true;
      }
    }); 
  }

}
