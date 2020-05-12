import { Component, OnInit, Input, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Basket } from 'src/app/shared/_models/basket';
import { OrderToCreate } from 'src/app/shared/_models/order';
import { Router, NavigationExtras } from '@angular/router';
import { environment } from 'src/environments/environment';

declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: FormGroup;
  @ViewChild('cardNumber', { static: true }) cardNumberElement;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement;
  @ViewChild('cardCvc', { static: true }) cardCvcElement;

  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);
  loading = false;
  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.stripe = Stripe(environment.stripeKey);
    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.cardNumber.destroy();
    this.cardCvc.destroy();
    this.cardExpiry.destroy();
  }

  onChange(event) {
    if (event.error) {
      this.cardErrors = event.error.message;
    } else {
      this.cardErrors = null;
    }

    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break;
    }
  }

  async submitOrder() {
    this.loading = true;

    const basket = this.basketService.getCurrentBasketValue();
    const createdOrder = await this.createOrder(basket);
    const paymentResult = await this.confirmPaymentWithStripe(basket);

    try {
      if (paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket.id);
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        this.toastr.error(paymentResult.error.message);
      }
    } catch (error) {
      console.log(error);
    }

    this.loading = false;
  }

  private async confirmPaymentWithStripe(basket: Basket) {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: { name: this.checkoutForm.get('paymentForm').get('nameOnCard').value },
      },
    });
  }

  private async createOrder(basket: Basket) {
    const orderToCreate = this.getOrderToCreate(basket);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }

  private getOrderToCreate(basket: Basket): OrderToCreate {
    return {
      basketId: basket.id,
      deliveryMethod: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      address: this.checkoutForm.get('addressForm').value,
    };
  }
}
