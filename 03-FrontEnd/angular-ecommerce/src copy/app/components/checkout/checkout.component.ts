import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formBuilder: FormBuilder, private luv2ShopFormService: Luv2ShopFormService) { }

  ngOnInit(){
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),

      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']

      }),

      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']

      }),

      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']

      })
    });

    //populate  credit card months
    
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => { 
        console.log("Retrieved credit card months row 64: " + JSON.stringify(data));
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
  
  }

  copyShippingAddressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

    }
  }

  onSubmit() {
    console.log("Handle the submit vutton");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The Email address is " + this.checkoutFormGroup.get('customer').value.email);

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

}
