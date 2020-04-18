import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../shared/_models/pagination';
import { Product } from '../shared/_models/product';
import { Brands } from '../shared/_models/brands';
import { ProductTypes } from '../shared/_models/productTypes';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/products';

  constructor(private readonly http: HttpClient) {}

  getProducts(brandId?: number, typeId?: number) {
    let params = new HttpParams();

    if (brandId) {
      params = params.append('brandId', brandId.toString());
    }

    if (typeId) {
      params = params.append('typeId', typeId.toString());
    }

    return this.http
      .get<Pagination<Product>>(`${this.baseUrl}`, { observe: 'response', params })
      .pipe(map((resp) => resp.body));
  }

  getBrands() {
    return this.http.get<Brands[]>(`${this.baseUrl}/brands`);
  }

  getTypes() {
    return this.http.get<ProductTypes[]>(`${this.baseUrl}/types`);
  }
}
