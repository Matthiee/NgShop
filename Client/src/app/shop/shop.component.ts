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
  @ViewChild('search', { static: true }) searchTerm: ElementRef;
  products: Product[];
  brands: Brands[];
  types: ProductTypes[];
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];
  shopParams = new ShopParams();
  totalCount: number;

  constructor(private readonly shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe(
      (data) => {
        this.products = data.data;
        this.shopParams.pageNumber = data.pageIndex;
        this.shopParams.pageSize = data.pageSize;
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
    this.shopParams.pageNumber = 1;
    this.shopParams.brandIdSelected = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.shopParams.pageNumber = 1;
    this.shopParams.typesIdSelected = typeId;
    this.getProducts();
  }

  onSortSelected(sort: string) {
    this.shopParams.sortSelected = sort;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event.page) {
      this.shopParams.pageNumber = event.page;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParams.pageNumber = 1;
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
