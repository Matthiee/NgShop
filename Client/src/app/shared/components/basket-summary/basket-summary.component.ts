import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OrderItem } from '../../_models/order';
import { BasketItem } from '../../_models/basket';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss'],
})
export class BasketSummaryComponent implements OnInit {
  @Output() decrement: EventEmitter<BasketItem> = new EventEmitter<BasketItem>();
  @Output() increment: EventEmitter<BasketItem> = new EventEmitter<BasketItem>();
  @Output() remove: EventEmitter<BasketItem> = new EventEmitter<BasketItem>();
  @Input() isBasket = true;
  @Input() items: BasketItem[] | OrderItem[] = [];
  @Input() isOrder = false;

  constructor() {}

  ngOnInit() {}

  decrementItemQuantity(item: BasketItem) {
    this.decrement.emit(item);
  }

  incrementItemQuantity(item: BasketItem) {
    this.increment.emit(item);
  }

  removeBasketItem(item: BasketItem) {
    this.remove.emit(item);
  }
}
