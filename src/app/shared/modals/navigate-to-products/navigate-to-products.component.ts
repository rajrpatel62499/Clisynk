import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AutomationService } from 'src/app/internal/automations/automation.service';
import { LoadingService } from 'src/app/internal/automations/loading.service';
import { HttpService } from 'src/app/services/http.service';


@Component({
  selector: 'app-navigate-to-products',
  templateUrl: './navigate-to-products.component.html',
  styleUrls: ['./navigate-to-products.component.css']
})
export class NavigateToProductsComponent implements OnInit {
  onClose: Subject<boolean>;
  loader = false;
  constructor(public http:HttpService, 
    public loadingService: LoadingService,
    public automationService: AutomationService) { }

  ngOnInit() {
  }

  async confirm() {

    this.loader = true;
    (await this.automationService.saveAutomation()).pipe(finalize(()=> {this.loader = false;})).subscribe(res => {
      console.log('draft saved')
      this.automationService.resetState();
      this.http.hideModal();
      this.onClose.next(true);
    });
  }


}
