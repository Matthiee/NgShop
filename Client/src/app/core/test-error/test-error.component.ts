import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { error } from 'protractor';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss'],
})
export class TestErrorComponent implements OnInit {
  baseUrl = environment.apiUrl;

  validationErrors: any;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {}

  get404Error() {
    this.http.get(this.baseUrl + '/products/42').subscribe(
      (resp) => {},
      (err) => {}
    );
  }

  get500Error() {
    this.http.get(this.baseUrl + '/buggy/servererror').subscribe(
      (resp) => {},
      (err) => {}
    );
  }

  get400Error() {
    this.http.get(this.baseUrl + '/buggy/badrequest').subscribe(
      (resp) => {},
      (err) => {}
    );
  }

  get400ErrorWithValidation() {
    this.http.get(this.baseUrl + '/products/forty').subscribe(
      (resp) => {},
      (err) => {
        this.validationErrors = err.errors;
      }
    );
  }
}
