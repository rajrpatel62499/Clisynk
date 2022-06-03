import { filter, first } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { AutomationService } from 'src/app/internal/automations/automation.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TIME_TYPES, DELAY_TYPES } from 'src/app/internal/automations/models/enum';

@Component({
  selector: 'app-time-schedule',
  templateUrl: './time-schedule.component.html',
  styleUrls: ['./time-schedule.component.css']
})
export class TimeScheduleComponent implements OnInit {

  form: FormGroup;
  atTime;
  startTime;
  endTime;
  TIME_TYPES = TIME_TYPES;
  DELAY_TYPES = DELAY_TYPES;
  get f() { return this.form.controls; }
  get isSpecificTime() { return !this.auto.isNullOrEmpty(this.form.get('delayedOptions.timeInterval.intervalType').value); }
  get isDelayed() { return this.form.get('isDelayed'); }

  get delayedOptions() { return this.form.get('delayedOptions'); }
  get delayType() { return this.form.get('delayedOptions.delayType'); }

  get dayInterval() { return this.form.get('delayedOptions.dayInterval'); }
  get dayIntervalType() { return this.form.get('delayedOptions.dayInterval.intervalType'); }
  get dayIntervalValue() { return this.form.get('delayedOptions.dayInterval.value'); }

  get timeInterval() { return this.form.get('delayedOptions.timeInterval'); }
  get timeIntervalType() { return this.form.get('delayedOptions.timeInterval.intervalType'); }
  get timeIntervalValue() { return this.form.get('delayedOptions.timeInterval.value'); }

  date: Date;
  copyDate: Date;

  constructor(public auto: AutomationService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.form = <FormGroup>_.cloneDeep(this.auto.getThenTaskByIndex())

    console.log(this.form.value);
    this.conditionalFormChanges();
  }

  conditionalFormChanges() {
    this.delayType.valueChanges.subscribe(res => {
      this.dayInterval.reset({
        intervalType: '',
        value: '',
      });
      this.timeInterval.reset({
        intervalType: '',
        value: [],
      })
    });


    this.isDelayed.valueChanges.subscribe(isDelayed => {
      if (isDelayed == false) {
        this.delayedOptions.reset({
          delayType: '',
          dayInterval: {
            intervalType: '',
            value: '',
          },
          timeInterval: {
            intervalType: '',
            value: [],
          }
        })
      } else {
        this.delayType.reset(DELAY_TYPES.WAIT);
      }
    })


    this.form.valueChanges.pipe(filter(() => this.form.valid)).subscribe(res => {
      // console.log(res)
      this.auto.updateThenTask(this.form);
    })

    if (moment(this.dayIntervalValue.value).toDate() instanceof Date) {
      const tIV: Array<string> = this.timeIntervalValue.value;
      if (!this.auto.isNullOrEmpty(tIV[0]) && this.auto.isNullOrEmpty(tIV[1])) {
        this.atTime = moment(tIV[0]).toDate();
      } else if (!this.auto.isNullOrEmpty(tIV[0]) && !this.auto.isNullOrEmpty(tIV[1])) {
        this.startTime = moment(tIV[0]).toDate();
        this.endTime = moment(tIV[1]).toDate();
      }
    }
    
    this.dayIntervalValue.valueChanges
      .pipe(
        filter((val) => this.delayType.value == DELAY_TYPES.WAIT_UNTIL && !this.auto.isNullOrEmpty(val)),
        first()
      )
      .subscribe(val => {
        console.log('first time called')
        this.timeInterval.reset({
          intervalType: TIME_TYPES.atTime,
          value: [],
        })
      })


  }


  atTimeChange() {
    let atTime = [];
    atTime[0] = this.atTime;
    this.timeIntervalValue.setValue(atTime);
  }

  betWeenTime = [];
  betweenTimeChange(type) {
    if (type == 'start') {
      this.betWeenTime[0] = this.startTime;
    } else if (type == 'end') {
      this.betWeenTime[1] = this.endTime;
    }
    this.timeIntervalValue.setValue(this.betWeenTime);
  }


}
