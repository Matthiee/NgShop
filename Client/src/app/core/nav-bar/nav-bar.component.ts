import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Basket } from 'src/app/shared/_models/basket';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  basket$: Observable<Basket>;

  constructor(private readonly basketService: BasketService) {}

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
  }
}
