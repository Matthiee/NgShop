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

  brandIdSelected = 0;
  typesIdSelected = 0;

  constructor(private readonly shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shopService.getProducts(this.brandIdSelected, this.typesIdSelected).subscribe(
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
        this.brands = [{ id: 0, name: 'All' }, ...data];
      },
      (error) => {
        console.warn(error);
      }
    );
  }

  getTypes() {
    this.shopService.getTypes().subscribe(
      (data) => {
        this.types = [{ id: 0, name: 'All' }, ...data];
      },
      (error) => {
        console.warn(error);
      }
    );
  }

  onBrandSelected(brandId: number) {
    this.brandIdSelected = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.typesIdSelected = typeId;
    this.getProducts();
  }
}
