import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-free-consulation',
  templateUrl: './free-consulation.component.html',
  styleUrls: ['./free-consulation.component.css']
})
export class FreeConsulationComponent implements OnInit {
  
  constructor(public http: HttpService) { }

  ngOnInit() {
  }

}
