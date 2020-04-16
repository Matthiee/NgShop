import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';
import { Product } from '../shared/_models/product';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: Product[];

  constructor(private readonly shopService: ShopService) {}

  ngOnInit(): void {
    this.shopService.getProducts().subscribe(
      (data) => {
        this.products = data.data;
      },
      (error) => {
        console.warn(error);
      }
    );
  }
}
