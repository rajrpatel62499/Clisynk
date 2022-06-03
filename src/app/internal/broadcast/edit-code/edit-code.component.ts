import {
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  Input,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { HttpService } from "src/app/services/http.service";
import { SaveTemplateComponent } from "src/app/shared/modals/save-template/save-template.component";

declare type ViewType = "paste-in" | "edit-code" | "mail";

@Component({
  selector: "edit-code",
  templateUrl: "./edit-code.component.html",
  styleUrls: ["./edit-code.component.css"],
  providers: [],
})
export class EditCodeComponent implements OnInit {
  @Output("changeView")
  changeViewEmitter = new EventEmitter<{html: string, view: ViewType}>();

  @Input('content')
  content: any = '';
  constructor(public http: HttpService,public sanitizer: DomSanitizer) {}

  ngOnInit() {}
  ngAfterViewInit() {
    // this.iframe.nativeElement.setAttribute('src', project.projectUrl);
  }

  contentChange(event) {
    // console.log(event);
    // console.log(this.content);
  }

  changeView(view: ViewType) {
    this.changeViewEmitter.emit({ html: this.content, view: view});
  }

  openSaveTemplate() {
    if (this.http.isNullOrEmpty(this.content)) {
      this.http.handleError("template code is required!");
      return;
    }
    const data = { html:this.content};
    const modalRef = this.http.showModal(SaveTemplateComponent, "xs", data);
    modalRef.content.onClose = new Subject<boolean>();
    modalRef.content.onClose.subscribe((res) => {
        if(res) {
          this.changeView('paste-in');
        }
    });

  }
}
