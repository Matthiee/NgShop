import { Component, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { Order } from '../shared/_models/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: Order[];

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.ordersService.getOrdersForUser().subscribe(
      (orders: Order[]) => {
        this.orders = orders;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
