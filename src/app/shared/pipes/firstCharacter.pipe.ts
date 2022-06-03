import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'firstChar'
})
export class FirstCharacterPipe implements PipeTransform {
    transform(value: string, arg1?: any): any {
        if (value) {
            let substr: string = value.substr(0, 1).toUpperCase();
            if (arg1) {
                substr = substr + arg1.substr(0, 1);
            }
            return substr.toUpperCase();
        } else {
            return;
        }
    }
}
