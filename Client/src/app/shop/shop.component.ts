import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';
import { Product } from '../shared/_models/product';
import { Brands } from '../shared/_models/brands';
import { ProductTypes } from '../shared/_models/productTypes';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: Product[];
  brands: Brands[];
  types: ProductTypes[];

  constructor(private readonly shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shopService.getProducts().subscribe(
      (data) => {
        this.products = data.data;
      },
      (error) => {
        console.warn(error);
      }
    );
  }

  getBrands() {
    this.shopService.getBrands().subscribe(
      (data) => {
        this.brands = data;
      },
      (error) => {
        console.warn(error);
      }
    );
  }

  getTypes() {
    this.shopService.getTypes().subscribe(
      (data) => {
        this.types = data;
      },
      (error) => {
        console.warn(error);
      }
    );
  }
}
