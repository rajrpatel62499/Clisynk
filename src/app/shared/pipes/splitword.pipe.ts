import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'splitword'
})
export class SplitwordPipe implements PipeTransform {

    transform(word: string): string {
        let abc;
        if (!word) {
            return word;
        }
        const result = this.checkdata(word);
        if (!result) {
            return word[0].toUpperCase() + word.substr(1).toLowerCase();
        } else {
            let data = '';
            let a = 0;
            for (const x of result) {
                abc = word[a].toUpperCase() + word.substr((a + 1), x - (a + 1)).toLowerCase() + ' ';
                data = data.concat(abc);
                a = x;
            }
            abc = word[a].toUpperCase() + word.substr((a + 1)).toLowerCase();
            data = data.concat(abc);
            return data;
        }
    }

    checkdata(word) {
        const data = [];
        for (let x = 0; x < word.length; x++) {
            if (this.isUpperCase(word.charAt(x))) {
                data.push(x);
            }
        }
        if (data.length > 0) {
            return data;
        }
        return false;
    }

    isUpperCase(aCharacter) {
        return (aCharacter >= 'A') && (aCharacter <= 'Z');
    }

}
