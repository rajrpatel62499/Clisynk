import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { NavigateToLeadFormsComponent } from 'src/app/shared/modals/navigate-to-lead-forms/navigate-to-lead-forms.component';
import { LeadFormDeletedComponent } from 'src/app/shared/modals/lead-form-deleted/lead-form-deleted.component';
import { SubmitfeedbackComponent } from 'src/app/shared/modals/submitfeedback/submitfeedback.component';
declare var $ : any;
import {Subject} from 'rxjs';
import { NavigateToAppointmentComponent } from 'src/app/shared/modals/navigate-to-appointment/navigate-to-appointment.component';
import { NavigateToTagsComponent } from 'src/app/shared/modals/navigate-to-tags/navigate-to-tags.component';
import { NavigateToProductsComponent } from 'src/app/shared/modals/navigate-to-products/navigate-to-products.component';
import { EditorContent } from 'src/app/shared/models/editor.model';
// import { AmazingTimePickerService } from 'amazing-time-picker';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-free-cosulation-when',
  templateUrl: './free-cosulation-when.component.html',
  styleUrls: ['./free-cosulation-when.component.css']
})
export class FreeCosulationWhenComponent implements OnInit {



  time
  timepickerinner = false
  ckeConfig: any = EditorContent;
  header1 = false;
  header2 = false;
  thenclick = false;
  addicon = false;
  tab: any = 'tab1';
  tab1 : any;
  tab2 : any;
  option:boolean=false;
  buttonName = 'Show more option';
  hide: any;
  deletepanel:boolean=false
  leadformnew = false
  appointment = false
  newallcontent = false
  laeddata = false
  paneldata = false
  paneldata1 = false
  tagpanel = false
  editleadformheader = false
  editappointmenttempllate = false
  edittagstemplate = true
  editproducts = false
  purchasepanel = false
  createtags = true
  createproduct = false
  // ---------------then--------------//

  editemail = false
  createemail = false
  nextpressemail = false 
  sendnotificationpanal = false
  mainicon = true
  createnotification = false
  maindropdown = true
  contactsub = true 
  buttonName1 = 'Show more option';

  constructor(public http:HttpService,
    // private atp: AmazingTimePickerService
    ) { }

  ngOnInit() {

    
  }

  editautomationmain(){
    this.header1 = true;
    this.header2 = true;
    this.editleadformheader = false;
    this.editappointmenttempllate = false;
    this.createtags =  true;
    this.editproducts = false;
    this.createproduct = false;
    this.createemail = false;
    this.nextpressemail = false
    this.createnotification = false
  }

  editappointment(){
    this.header1 = true;
    this.header2 = true;
    this.editleadformheader = true;
    this.editappointmenttempllate = true;
    this.edittagstemplate = true;
    this.createtags =  true
    this.editproducts = false;
    this.createproduct = false;
    this.createemail = false
    this.nextpressemail = false
    this.createnotification = false
  }

  edittags(){
    this.header1 = true;
    this.header2 = true;
    this.editleadformheader = true;
    this.editappointmenttempllate = false;
    this.edittagstemplate = false;
    this.createtags =  true
    this.editproducts = false;
    this.createproduct = false;
    this.createemail = false;
    this.nextpressemail = false
    this.createnotification = false
  }
  
  createtagsmethod(){
      this.createtags = false
      this.edittagstemplate = true;
      this.editappointmenttempllate = false;
      this.header1 = true;
      this.header2 = true;
      this.editleadformheader = true;
      this.editproducts = false;
      this.createproduct = false;
      this.createemail = false;
      this.nextpressemail = false
      this.createnotification = false
  }

  editproduct(){
    this.header1 = true;
    this.header2 = true;
    this.editproducts = true;
    this.editleadformheader = true;
    this.editappointmenttempllate = false;
    this.edittagstemplate = true;
    this.createtags =  true
    this.createproduct = false;
    this.createemail = false;
    this.nextpressemail = false
    this.createnotification = false
  }

  createproductmethod(){
    this.header1 = true;
    this.header2 = true;
    this.createproduct = true;
    this.editproducts = false;
    this.editleadformheader = true;
    this.editappointmenttempllate = false;
    this.edittagstemplate = true;
    this.createtags =  true
    this.createemail = false
    this.nextpressemail = false
    this.createnotification = false

  }

  closechooseform(){
    this.header1 = false;
    this.header2 = false;
  }

  thenclicks(){
    this.thenclick = true;
    this.tab = 'tab2';
    this.deletepanel = false;
    this.paneldata=true
    this.paneldata1 = false;
    this.tagpanel = false;
    this.purchasepanel = false;
    this.createemail = false
    this.nextpressemail = false
    this.createnotification = false
  }

  whenclicks(){
    this.thenclick= false;
    this.tab = 'tab1';
    this.paneldata=false
    this.deletepanel = false;
    
  }
  // ----------------------then-edit--------------------//
  editemailtemplate(){
    this.header1 = true;
    this.header2 = true;
    this.editemail = true;
    this.createproduct = false;
    this.editproducts = false;
    this.editleadformheader = true;
    this.editappointmenttempllate = false;
    this.edittagstemplate = true;
    this.createtags =  true
    this.createemail = false
    this.nextpressemail = false
    this.createnotification = false
  }
  startnewemail(){
    this.header1 = true;
    this.header2 = true;
    this.editemail = false;
    this.createproduct = false;
    this.editproducts = false;
    this.editleadformheader = true;
    this.editappointmenttempllate = false;
    this.edittagstemplate = true;
    this.createtags =  true
    this.createemail = true
    this.nextpressemail = false
    this.createnotification = false
  }


  nextbuttonemail(){
    this.header1 = true;
    this.header2 = true;
    this.editemail = false;
    this.createproduct = false;
    this.editproducts = false;
    this.editleadformheader = true;
    this.editappointmenttempllate = false;
    this.edittagstemplate = true;
    this.createtags =  true
    this.createemail = false
    this.nextpressemail = true
    this.createnotification = false
  }

  createnotifications(){
    this.header1 = true;
    this.header2 = true;
    this.editemail = false;
    this.createproduct = false;
    this.editproducts = false;
    this.editleadformheader = true;
    this.editappointmenttempllate = false;
    this.edittagstemplate = true;
    this.createtags =  true
    this.createemail = false
    this.nextpressemail = false
    this.createnotification = true
  }

  sendnotificationcard(){
    this.sendnotificationpanal = true
    this.addicon = false
  }

  clickadd(){
    this.addicon = true;
  }

  gotoform(){
    this.http.showModal(NavigateToLeadFormsComponent, 'xs lead-form-popup-main');
  }

  gotoappointment(){
    this.http.showModal(NavigateToAppointmentComponent, 'xs lead-form-popup-main navigated-appointment-modal');
  }

  gotomanagetag(){
    this.http.showModal(NavigateToTagsComponent, 'xs lead-form-popup-main navigated-appointment-modal');
  }
  gotomanageproduct(){
    this.http.showModal(NavigateToProductsComponent, 'xs lead-form-popup-main manage-product-modal');
  }

  deleteleadform(){
    const modalRef = this.http.showModal(LeadFormDeletedComponent, 'xs navigated-to-lead');
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe(() => {
      this.deletepanel=true;
  });
  }

  deleteemail(){
    this.http.showModal(LeadFormDeletedComponent, 'xs navigated-to-lead');
  }

  openSubmitfeedback() {
    this.http.showModal(SubmitfeedbackComponent);
  }

  Showoption(){
    this.option = !this.option
    // window.scrollTo(1900, 1900);
    document.body.scrollTop = 0;
    if(this.option) {
      this.buttonName = 'Show less option'
      // console.log(this.option)
      }
      else {
      this.buttonName = 'Show more option'
      }
  }

  Showoption12(){
    this.option = !this.option
    // window.scrollTo(1900, 1900);
    document.body.scrollTop = 0;
    if(this.option) {
      this.buttonName1 = 'Show less option'
      // console.log(this.option)
      
      }
      else {
      this.buttonName1 = 'Show more option'
      }
  }

  open() {
    this.time = ''
    // const amazingTimePicker = this.atp.open({
    //   time:this.time
    // });
    // amazingTimePicker.afterClose().subscribe(time => {
    //   this.time = time + ( this.time > 24 ? 'AM' : 'PM') 
    // });
  }

 
  
  

  leadformsubmittednew(){
    this.deletepanel = false;
    this.header2 = false;
    // this.appointment = false; 
    this.tagpanel = false;
    this.purchasepanel = false;
  }

  appointmentSubmitted(){
    this.paneldata=true
    this.paneldata1 = true;
    this.header2 = false;
    // this.appointment = false; 
    this.tagpanel = false;
    this.purchasepanel = false;
  }
  tagisadded(){
    this.header2 = false;
    this.paneldata = true;
    this.paneldata1 = false
    this.tagpanel = true;
    this.purchasepanel = false;
    
  }

  purchasemethod(){
    this.header2 = false;
    this.purchasepanel = true;
    this.paneldata = true;
    this.paneldata1 = false;
    this.tagpanel = false;
  }

  contacts(){
    this.maindropdown = false
    this.contactsub = false
  }
}
