import { DelayedOptions } from './../../../models/automation';
import { Pipe, PipeTransform } from '@angular/core';
import { TIME_TYPES, DELAY_TYPES } from '../../../models/enum';
import * as moment from 'moment'
@Pipe({
  name: 'thenTime'
})
export class ThenTimePipe implements PipeTransform {
  TIME_TYPES = TIME_TYPES;
  DELAY_TYPES = DELAY_TYPES;
  transform(value: any, ...args: any[]): any {
    let text = 'Immediate';
    const dOpt: DelayedOptions = value;
    if (dOpt && dOpt.delayType == DELAY_TYPES.WAIT) {
      text = `wait for ${dOpt.dayInterval.value} ${dOpt.dayInterval.intervalType}`;
    } else if (dOpt && dOpt.delayType == DELAY_TYPES.WAIT_UNTIL) {
      const date = moment(dOpt.dayInterval.value); 
      if (dOpt.timeInterval.intervalType == TIME_TYPES.atTime) {
        const at = moment(dOpt.timeInterval.value[0]);
        text = `wait Until ${date.format('LL')} at ${at.format('LT')}`
      } else if (dOpt.timeInterval.intervalType == TIME_TYPES.betweenTime) {
        const start = moment(dOpt.timeInterval.value[0]);
        const end = moment(dOpt.timeInterval.value[1]);
        text = `wait Until ${date.format('LL')} between ${start.format('LT')} and ${end.format('LT')}`
      }
    }

    return text;
  }

}
