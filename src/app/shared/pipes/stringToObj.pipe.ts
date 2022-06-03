import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'stringToObj'
})
export class StringToObjPipe implements PipeTransform {
    transform(value: any, arg1?: any): any {
        if (value) {
            return JSON.parse(value);
        } else {
            return;
        }
    }
}
