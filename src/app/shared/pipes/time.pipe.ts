import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'time'
})
export class ChangeTimePipe implements PipeTransform {
    transform(value: any, arg1?: any): any {
        if (value) {
            return moment().month(0).date(1).hours(0).minutes(value).seconds(0).milliseconds(0).format('hh:mm a').toUpperCase();
        } else {
            return;
        }
    }
}
