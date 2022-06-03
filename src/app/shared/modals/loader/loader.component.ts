import {Component, OnInit, Input} from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
})
export class LoaderComponent implements OnInit {

    @Input() showLoader: boolean;
    @Input() length: boolean;

    constructor(
        public http: HttpService,
    ) {

    }

    ngOnInit(): void {
    }


}
