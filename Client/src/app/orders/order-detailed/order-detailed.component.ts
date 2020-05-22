import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';
import { Order } from 'src/app/shared/_models/order';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss'],
})
export class OrderDetailedComponent implements OnInit {
  order: Order;

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private ordersService: OrdersService
  ) {
    this.breadcrumbService.set('@OrderDetailed', '');
  }

  ngOnInit() {
    this.ordersService.getOrderDetailed(+this.route.snapshot.paramMap.get('id')).subscribe(
      (order: Order) => {
        this.order = order;
        this.breadcrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
