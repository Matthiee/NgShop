import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../shared/_models/pagination';
import { Product } from '../shared/_models/product';
import { Brands } from '../shared/_models/brands';
import { ProductTypes } from '../shared/_models/productTypes';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/_models/shopParams';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/products';

  constructor(private readonly http: HttpClient) {}

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.brandIdSelected !== 0) {
      params = params.append('brandId', shopParams.brandIdSelected.toString());
    }

    if (shopParams.typesIdSelected !== 0) {
      params = params.append('typeId', shopParams.typesIdSelected.toString());
    }

    if (shopParams.sortSelected) {
      params = params.append('sort', shopParams.sortSelected);
    }

    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }

    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

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
