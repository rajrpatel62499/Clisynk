import {FormControl} from '@angular/forms';

export class PasswordValidator {
    public static validPassword(control: FormControl): { [key: string]: any } {
        const hasNumber = /[0-9]/.test(control.value);
        const hasUpper = /[A-Z]/.test(control.value);
        const hasLower = /[a-z]/.test(control.value);
        const hasSpecialCharacter = /[$@$!%*?&]/.test(control.value);
        let hasMinLenth = false;
        let hasMaxnLenth = false;
        if (control.value !== null && control.value !== undefined) {
            hasMinLenth = control.value.length >= 6;
            hasMaxnLenth = control.value.length <= 30;
        } else {
            hasMinLenth = false;
            hasMaxnLenth = false;
        }
        const valid = hasNumber && hasUpper && hasLower && hasSpecialCharacter && hasMinLenth && hasMaxnLenth;
        if (!valid) {
            // return what´s not valid
            return {'validPassword': {valid: false}};
        }
        return null;
    }
}

