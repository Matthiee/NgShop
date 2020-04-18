import { Injectable } from '@angular/core';
import { RouterEvent } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Pagination } from '../shared/_models/pagination';
import { Product } from '../shared/_models/product';
import { Brands } from '../shared/_models/brands';
import { ProductTypes } from '../shared/_models/productTypes';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/products';

  constructor(private readonly http: HttpClient) {}

  getProducts() {
    return this.http.get<Pagination<Product>>(`${this.baseUrl}`);
  }

  getBrands() {
    return this.http.get<Brands[]>(`${this.baseUrl}/brands`);
  }

  getTypes() {
    return this.http.get<ProductTypes[]>(`${this.baseUrl}/types`);
  }
}
