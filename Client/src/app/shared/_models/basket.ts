import { v4 as uuid } from 'uuid';

export class Basket {
  id = uuid();
  items: BasketItem[] = [];
  clientSecret?: string;
  paymentIntentId?: string;
  deliveryMethod?: number;
  shippingPrice?: number;
}

export interface BasketItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  brand: string;
  type: string;
}

export interface BasketTotals {
  shipping: number;
  subtotal: number;
  total: number;
}
