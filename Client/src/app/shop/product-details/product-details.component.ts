import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/_models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product;

  constructor(
    private readonly shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService
  ) {
    bcService.set('@productDetails', '');
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe(
      (data) => {
        this.product = data;
        this.bcService.set('@productDetails', this.product.name);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
