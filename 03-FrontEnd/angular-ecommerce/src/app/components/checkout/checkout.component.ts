import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/service/cart.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  constructor(private formBuilder: FormBuilder, private luv2ShopFormService: Luv2ShopFormService, private cartService: CartService) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({

        firstName: new FormControl('',
                               [Validators.required,
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhiteSpace]),

        lastName: new FormControl('',
                               [Validators.required,
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhiteSpace]),

        email: new FormControl('',
                               [Validators.required,
                                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        )

      }),

      shippingAddress: this.formBuilder.group({
        street:new FormControl('', [Validators.required, Validators.minLength(3),
                                   Luv2ShopValidators.notOnlyWhiteSpace]),

        city:new FormControl('', [Validators.required,  Validators.minLength(3),
                                 Luv2ShopValidators.notOnlyWhiteSpace]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('',  [Validators.required]),
        
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                                     Luv2ShopValidators.notOnlyWhiteSpace])

      }),

              billingAddress: this.formBuilder.group({
                street:new FormControl('', [Validators.required, Validators.minLength(3),
                  Luv2ShopValidators.notOnlyWhiteSpace]),

        city:new FormControl('', [Validators.required,  Validators.minLength(3),
                Luv2ShopValidators.notOnlyWhiteSpace]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('',  [Validators.required]),

        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                    Luv2ShopValidators.notOnlyWhiteSpace])

      }),

        creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2),
                                        Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']

      })
    });

    //populate  credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //populate  credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card Years: " + JSON.stringify(data));
        this.creditCardYears = data;

      }
    );

    //populate country
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrived countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  reviewCartDetails() {
    
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }
  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get street(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get city(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get state(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get zipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get country(){return this.checkoutFormGroup.get('shippingAddress.country');}

  get billingStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}
  get billingcountry(){return this.checkoutFormGroup.get('billingAddress.country');}

  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}

  copyShippingAddressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        
         //bug fix to state
         this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

               //bug fix to state
               this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();

    }
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The Email address is " + this.checkoutFormGroup.get('customer').value.email);

    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);

  }

  handleMontsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    //if current year equal the  selected year , then start with the currennt month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months row 120 : " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);


    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates =data;

        }
        else{
          this.billingAddressStates= data;
        }
        //select first item default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }
}
