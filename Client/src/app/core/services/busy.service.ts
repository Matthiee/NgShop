import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private spinner: NgxSpinnerService) {}

  busy() {
    this.busyRequestCount++;
    this.spinner.show(undefined, {
      type: 'timer',
      bdColor: 'rgba(255,255,255,0.7)',
      color: '#AAF0D1',
      fullScreen: true,
    });
  }

  hide() {
    this.busyRequestCount--;

    if (this.busyRequestCount > 0) {
      return;
    }

    this.busyRequestCount = 0;
    this.spinner.hide();
  }
}
