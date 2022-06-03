import { ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { HttpService } from "src/app/services/http.service";
import { NavigateToProductsComponent } from "src/app/shared/modals/navigate-to-products/navigate-to-products.component";
import { NavigateToTagsComponent } from "src/app/shared/modals/navigate-to-tags/navigate-to-tags.component";
import { EventType } from "../../../automation-constants";
import { AutomationService } from "../../../automation.service";
import { WhenEvent } from "../../../models/automation";
import { FormType } from "../../../models/enum";

export class CardHelperFunctions {
    constructor(public changeDetection: ChangeDetectorRef,
      public automationService: AutomationService,
      public router: Router,
      public http: HttpService) { }
  
    public makeid(length) {
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    
    goToLeadFormPreview() {
      const whenEvent: WhenEvent = this.automationService.getWhenEvent().value;
      if (whenEvent.eventData.params.formTag == FormType.LEAD_FORM) {
        this.router.navigate([]).then(result => { window.open(`/preview-leadform/${whenEvent.eventData.dataId}`) })
      } else if (whenEvent.eventData.params.formTag == FormType.SMART_FORM) {
        this.router.navigate([]).then(result => { window.open(`/preview-smartform/${whenEvent.eventData.dataId}`) })
      }
      this.automationService.updateEventType(EventType.WHEN);
    }
  
    goToManageTags() {
      const modalRef = this.http.showModal(NavigateToTagsComponent, 'xs lead-form-popup-main navigated-appointment-modal');
      modalRef.content.onClose = new Subject<boolean>();
      modalRef.content.onClose.subscribe((res) => {
        if (res) {
          this.router.navigate(["/contacts/tag-settings"]);
        }
      })
    }
  
    goToManageProducts() {
      const modalRef = this.http.showModal(NavigateToProductsComponent, 'xs lead-form-popup-main manage-product-modal');
      modalRef.content.onClose = new Subject<boolean>();
      modalRef.content.onClose.subscribe((res) => {
        if (res) {
          this.router.navigate(["/settings/products"]);
        }
      })
    }
  }
  