import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Basket, BasketItem, BasketTotals } from '../shared/_models/basket';
import { map } from 'rxjs/operators';
import { Product } from '../shared/_models/product';
import { DeliveryMethod } from '../shared/_models/deliveryMethod';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  baseUrl = environment.apiUrl;

  private basketSource = new BehaviorSubject<Basket>(null);
  private basketTotalSource = new BehaviorSubject<BasketTotals>(null);

  basket$ = this.basketSource.asObservable();
  basketTotal$ = this.basketTotalSource.asObservable();

  shipping = 0;

  constructor(private http: HttpClient) {}

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    this.shipping = deliveryMethod.price;
    this.calculateTotals();
  }

  getBasket(id: string) {
    return this.http.get<Basket>(`${this.baseUrl}/basket?id=${id}`).pipe(
      map((basket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
      })
    );
  }

  updateBasket(basket: Basket) {
    return this.http.post<Basket>(`${this.baseUrl}/basket`, basket).subscribe(
      (resp) => {
        this.basketSource.next(basket);
        this.calculateTotals();
      },
      (err) => console.log(err)
    );
  }

  deleteLocalBasket(id: string) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  deleteBasket(id: string) {
    return this.http.delete(`${this.baseUrl}/basket?id=${id}`).subscribe(
      () => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
      },
      (err) => console.log(err)
    );
  }

  incrementItemQuantity(item: BasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex((x) => x.id === item.id);

    basket.items[foundItemIndex].quantity++;
    this.updateBasket(basket);
  }

  decrementItemQuantity(item: BasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex((x) => x.id === item.id);

    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.updateBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: BasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some((x) => x.id === item.id)) {
      basket.items = basket.items.filter((i) => i.id !== item.id);

      if (basket.items.length > 0) {
        this.updateBasket(basket);
      } else {
        this.deleteBasket(basket.id);
      }
    }
  }

  addItemToBasket(item: Product, quantity = 1) {
    const itemToAdd: BasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.CreateEmptyBasket();

    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);

    this.updateBasket(basket);
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    const idx = items.findIndex((i) => i.id === itemToAdd.id);

    if (idx === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[idx].quantity += quantity;
    }

    return items;
  }

  private CreateEmptyBasket(): Basket {
    const basket = new Basket();

    localStorage.setItem('basket_id', basket.id);

    return basket;
  }

  private mapProductItemToBasketItem(item: Product, quantity: number): BasketItem {
    return {
      id: item.id,
      name: item.name,
      brand: item.productBrand,
      pictureUrl: item.pictureUrl,
      quantity,
      price: item.price,
      type: item.productType,
    };
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket?.items.reduce((a, b) => b.price * b.quantity + a, 0) ?? 0;
    const total = shipping + subtotal;

    this.basketTotalSource.next({ shipping, total, subtotal });
  }
}
