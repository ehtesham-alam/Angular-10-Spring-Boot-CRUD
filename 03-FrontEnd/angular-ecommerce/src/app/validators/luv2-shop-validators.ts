import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    //whitespace validaton
    static notOnlyWhiteSpace(control: FormControl): ValidationErrors {

        //check if string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {

            //invalid , retun error object
            return { 'notOnlyWhiteSpace': false }; 

        }
        else {
            //valid, return null
            return null;
        }

    }
}
