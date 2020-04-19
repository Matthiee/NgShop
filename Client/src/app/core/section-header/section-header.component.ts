import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Subscription, Observable } from 'rxjs';
import { Breadcrumb } from 'xng-breadcrumb/lib/breadcrumb';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
})
export class SectionHeaderComponent implements OnInit {
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private bcService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.bcService.breadcrumbs$;
  }
}
