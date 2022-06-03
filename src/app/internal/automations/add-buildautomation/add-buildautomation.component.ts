import { Component, OnInit, Inject } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
declare var $ : any;
// import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-add-buildautomation',
  templateUrl: './add-buildautomation.component.html',
  styleUrls: ['./add-buildautomation.component.css']
})
export class AddBuildautomationComponent implements OnInit {


  option:boolean=false;
  buttonName = 'Show more option';
  hide: any;

  leadform = false;
  appointment = false;
  aftersubmits = false


  constructor(public http:HttpService) { }

  ngOnInit() {
    $(document).ready(function(){
      $(".scroll-class").click(function() {
          $('html,body').animate({                                                          //  fine in moz, still quicker in chrome. 
              scrollTop: $(".all-option-available").offset().top},
              'slow');
      }); 
       }); 
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

  // ----------lead-formsubmited---------//
  Aftersubmit(){
    this.leadform = true;
    this.aftersubmits =true;
    this.appointment = false;
    
  }

  Appointment(){
    this.leadform = true;
    this.aftersubmits =false;
    this.appointment = true;
  }
}
