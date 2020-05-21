import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../shared/_models/pagination';
import { Product } from '../shared/_models/product';
import { Brands } from '../shared/_models/brands';
import { ProductTypes } from '../shared/_models/productTypes';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/_models/shopParams';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = `${environment.apiUrl}/products`;
  products: Product[] = [];
  brands: Brands[] = [];
  types: ProductTypes[] = [];
  pagination = new Pagination<Product>();
  shopParams = new ShopParams();

  constructor(private readonly http: HttpClient) {}

  getProducts(useCache: boolean) {
    if (useCache === false) {
      this.products = [];
    } else if (useCache && this.products.length > 0) {
      const pagesReceived = Math.ceil(this.products.length / this.shopParams.pageSize);
      if (this.shopParams.pageNumber <= pagesReceived) {
        this.pagination.data = this.products.slice(
          (this.shopParams.pageNumber - 1) * this.shopParams.pageSize,
          this.shopParams.pageNumber * this.shopParams.pageSize
        );

        return of(this.pagination);
      }
    }

    let params = new HttpParams();

    if (this.shopParams.brandIdSelected !== 0) {
      params = params.append('brandId', this.shopParams.brandIdSelected.toString());
    }

    if (this.shopParams.typesIdSelected !== 0) {
      params = params.append('typeId', this.shopParams.typesIdSelected.toString());
    }

    if (this.shopParams.sortSelected) {
      params = params.append('sort', this.shopParams.sortSelected);
    }

    if (this.shopParams.search) {
      params = params.append('search', this.shopParams.search);
    }

    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageSize', this.shopParams.pageSize.toString());

    return this.http
      .get<Pagination<Product>>(`${this.baseUrl}`, { observe: 'response', params })
      .pipe(
        map((resp) => {
          this.products = [...this.products, ...resp.body.data];
          this.pagination = resp.body;
          return this.pagination;
        })
      );
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number) {
    const product = this.products.find((p) => p.id === id);

    if (product) {
      return of(product);
    }

    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getBrands() {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http.get<Brands[]>(`${this.baseUrl}/brands`).pipe(
      map((response) => {
        this.brands = response;
        return response;
      })
    );
  }

  getTypes() {
    if (this.types.length > 0) {
      return of(this.types);
    }

    return this.http.get<ProductTypes[]>(`${this.baseUrl}/types`).pipe(
      map((response) => {
        this.types = response;
        return response;
      })
    );
  }
}
