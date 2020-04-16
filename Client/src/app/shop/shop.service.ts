import { Injectable } from '@angular/core';
import { RouterEvent } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Pagination } from '../shared/_models/pagination';
import { Product } from '../shared/_models/product';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api';

  constructor(private readonly http: HttpClient) {}

  getProducts() {
    return this.http.get<Pagination<Product>>(`${this.baseUrl}/products`);
  }
}
