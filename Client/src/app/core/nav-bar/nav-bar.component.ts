import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Basket } from 'src/app/shared/_models/basket';
import { BasketService } from 'src/app/basket/basket.service';
import { User } from 'src/app/shared/_models/user';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  basket$: Observable<Basket>;
  currentUser$: Observable<User>;
  constructor(private readonly basketService: BasketService, private readonly accountService: AccountService) {}

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
    this.currentUser$ = this.accountService.currentUser$;
  }

  logout() {
    this.accountService.logout();
  }
}
