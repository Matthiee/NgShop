import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DeliveryMethod } from '../shared/_models/deliveryMethod';
import { OrderToCreate } from '../shared/_models/order';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getDeliveryMethods() {
    return this.http
      .get<DeliveryMethod[]>(`${this.baseUrl}/deliveryMethods`)
      .pipe(map((dm) => dm.sort((a, b) => b.price - a.price)));
  }

  createOrder(order: OrderToCreate) {
    return this.http.post(this.baseUrl, order);
  }
}
