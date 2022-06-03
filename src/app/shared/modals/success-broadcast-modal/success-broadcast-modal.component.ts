import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-success-broadcast-modal',
  templateUrl: './success-broadcast-modal.component.html',
  styleUrls: ['./success-broadcast-modal.component.css']
})
export class SuccessBroadcastModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SuccessBroadcastModalComponent>) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
