import { Component, Input, OnInit } from '@angular/core';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input() 
  length: number;

  constructor(public loadingService: LoadingService) { }

  ngOnInit() {
  }

}
