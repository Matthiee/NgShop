import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject, of } from 'rxjs';
import { User } from '../shared/_models/user';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Address } from '../shared/_models/address';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = `${environment.apiUrl}/account`;

  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  loadCurrentUser(token: string) {
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http
      .get<User>(this.baseUrl, { headers })
      .pipe(
        map((user) => {
          if (user) {
            localStorage.setItem('token', user.token);
            this.currentUserSource.next(user);
          }
        })
      );
  }

  login(values: any) {
    return this.http.post<User>(`${this.baseUrl}/login`, values).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(values: any) {
    return this.http.post<User>(`${this.baseUrl}/register`, values).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(`${this.baseUrl}/emailexists?email=${email}`);
  }

  getUserAddress() {
    return this.http.get<Address>(`${this.baseUrl}/address`);
  }

  updateUserAddress(address: Address) {
    return this.http.put<Address>(this.baseUrl + '/address', address);
  }
}
