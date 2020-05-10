import { Component, OnInit, Input } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { Observable } from 'rxjs';
import { Basket } from 'src/app/shared/_models/basket';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss'],
})
export class CheckoutReviewComponent implements OnInit {
  @Input() appStepper: CdkStepper;

  basket$: Observable<Basket>;

  constructor(private basketServer: BasketService) {}

  ngOnInit(): void {}

  createPaymentIntent() {
    return this.basketServer.createPaymentIntent().subscribe(
      (resp) => {
        this.appStepper.next();
      },
      (err) => console.log(err)
    );
  }
}
