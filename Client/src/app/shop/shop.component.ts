import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ShopService } from './shop.service';
import { Product } from '../shared/_models/product';
import { Brands } from '../shared/_models/brands';
import { ProductTypes } from '../shared/_models/productTypes';
import { ShopParams } from '../shared/_models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search') searchTerm: ElementRef;
  products: Product[];
  brands: Brands[];
  types: ProductTypes[];
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];
  shopParams: ShopParams;
  totalCount: number;

  constructor(private readonly shopService: ShopService) {
    this.shopParams = shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts(true);
    this.getBrands();
    this.getTypes();
  }

  getProducts(useCache = false) {
    this.shopService.getProducts(useCache).subscribe(
      (data) => {
        this.products = data.data;
        this.totalCount = data.count;
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
    const params = this.shopService.getShopParams();
    params.pageNumber = 1;
    params.brandIdSelected = brandId;
    this.shopService.setShopParams(params);

    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    params.pageNumber = 1;
    params.typesIdSelected = typeId;
    this.shopService.setShopParams(params);

    this.getProducts();
  }

  onSortSelected(sort: string) {
    const params = this.shopService.getShopParams();
    params.sortSelected = sort;
    this.shopService.setShopParams(params);

    this.getProducts();
  }

  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event.page) {
      params.pageNumber = event.page;
      this.shopService.setShopParams(params);

      this.getProducts(true);
    }
  }

  onSearch() {
    const params = this.shopService.getShopParams();
    params.pageNumber = 1;
    params.search = this.searchTerm.nativeElement.value;
    this.shopService.setShopParams(params);

    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }
}
