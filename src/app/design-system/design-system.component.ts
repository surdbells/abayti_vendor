import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import {
  AxMultiselectComponent,
  AxMultiselectOption,
  AxComboboxComponent,
  AxComboboxOption,
  AxDatePickerComponent,
  AxDateRange,
} from '../shared/forms';
import {
  AxModalService,
  AxDrawerService,
  AxTooltipDirective,
  AxPopoverDirective,
  AxDropdownDirective,
  AxDropdownItemDirective,
  AxCollapseDirective,
  AxTabsComponent,
  AxTabComponent,
  AxAccordionComponent,
  AxAccordionItemComponent,
} from '../shared/overlays';
import { SampleModalComponent } from './sample-modal.component';
import { SampleDrawerComponent } from './sample-drawer.component';
import {
  AxTableComponent,
  AxColumnComponent,
  AxPaginationComponent,
  AxBreadcrumbComponent,
  AxProgressComponent,
  AxSkeletonComponent,
  AxEmptyStateComponent,
} from '../shared/data';

/**
 * Design-system demo — exercises every Phase 2 form control AND every
 * Phase 3 overlay / feedback component. Temporary route; removed in
 * Phase 11.
 */
@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AxMultiselectComponent,
    AxComboboxComponent,
    AxDatePickerComponent,
    AxTooltipDirective,
    AxPopoverDirective,
    AxDropdownDirective,
    AxDropdownItemDirective,
    AxCollapseDirective,
    AxTabsComponent,
    AxTabComponent,
    AxAccordionComponent,
    AxAccordionItemComponent,
    AxTableComponent,
    AxColumnComponent,
    AxPaginationComponent,
    AxBreadcrumbComponent,
    AxProgressComponent,
    AxSkeletonComponent,
    AxEmptyStateComponent,
  ],
  templateUrl: './design-system.component.html',
})
export class DesignSystemComponent {
  private readonly modal = inject(AxModalService);
  private readonly drawer = inject(AxDrawerService);
  private readonly toast = inject(HotToastService);

  // Phase 2 state
  categoryIds: (string | number)[] = ['electronics'];
  countryId: string | number | null = 'ae';
  singleDate: Date | null = null;
  dateRange: AxDateRange | null = null;
  notifications = true;
  marketing = false;
  shipping = 'standard';
  quantity = 50;

  // Phase 3 state
  tabIndex = 0;
  collapseOpen = false;
  lastModalResult: unknown = null;
  lastDrawerResult: unknown = null;

  // Dropdown data (Phase 2)
  categoryOptions: AxMultiselectOption[] = [
    { id: 'electronics', label: 'Electronics' },
    { id: 'fashion',     label: 'Fashion & apparel' },
    { id: 'home',        label: 'Home & kitchen' },
    { id: 'beauty',      label: 'Beauty & personal care' },
    { id: 'sports',      label: 'Sports & outdoors' },
    { id: 'books',       label: 'Books & media' },
    { id: 'toys',        label: 'Toys & games' },
    { id: 'grocery',     label: 'Grocery & gourmet' },
    { id: 'auto',        label: 'Automotive' },
    { id: 'pet',         label: 'Pet supplies' },
  ];

  countryOptions: AxComboboxOption[] = [
    { id: 'ae', label: 'United Arab Emirates' },
    { id: 'sa', label: 'Saudi Arabia' },
    { id: 'om', label: 'Oman' },
    { id: 'qa', label: 'Qatar' },
    { id: 'bh', label: 'Bahrain' },
    { id: 'kw', label: 'Kuwait' },
    { id: 'jo', label: 'Jordan' },
    { id: 'eg', label: 'Egypt' },
    { id: 'ng', label: 'Nigeria' },
    { id: 'gh', label: 'Ghana' },
    { id: 'ke', label: 'Kenya' },
    { id: 'gb', label: 'United Kingdom' },
    { id: 'us', label: 'United States' },
  ];

  // ---- Phase 3 actions ----
  openModal(): void {
    const ref = this.modal.open(SampleModalComponent, {
      size: 'md',
      data: { title: 'Edit profile' },
      ariaLabel: 'Edit profile',
    });
    ref.afterClosed().subscribe(result => {
      this.lastModalResult = result ?? 'dismissed';
      if (result) this.toast.success('Profile saved');
    });
  }

  openLargeModal(): void {
    this.modal.open(SampleModalComponent, {
      size: 'lg',
      data: { title: 'Large modal example' },
    });
  }

  openRightDrawer(): void {
    const ref = this.drawer.open(SampleDrawerComponent, {
      size: 'md',
      position: 'right',
      data: { orderRef: 'ABY-240098' },
      ariaLabel: 'Order details',
    });
    ref.afterClosed().subscribe(result => {
      this.lastDrawerResult = result ?? 'dismissed';
    });
  }

  openLeftDrawer(): void {
    this.drawer.open(SampleDrawerComponent, {
      size: 'sm',
      position: 'left',
      data: { orderRef: 'ABY-240099' },
    });
  }

  showToast(kind: 'success' | 'error' | 'info' = 'success'): void {
    if (kind === 'success') this.toast.success('Changes saved successfully');
    else if (kind === 'error') this.toast.error('Something went wrong');
    else this.toast.info('Heads up — this is an info toast');
  }

  onIndeterminateClick(input: HTMLInputElement) {
    input.indeterminate = true;
  }

  // For dropdown demo menu actions
  menuAction(action: string): void {
    this.toast.success(`Selected: ${action}`);
  }

  // ---------- Phase 4: data display state ----------
  tablePageIndex = 0;
  tablePageSize = 5;
  tableSelection: any[] = [];
  progressValue = 60;

  readonly breadcrumbTrail = [
    { label: 'Dashboard', link: '/backend', icon: 'home' },
    { label: 'Orders', link: '/processing' },
    { label: 'ABY-240098' },
  ];

  readonly sampleOrders = [
    { id: 1,  ref: 'ABY-240100', customer: 'Amal Al-Maktoum', total: 1240, status: 'Delivered',       date: '2026-04-22' },
    { id: 2,  ref: 'ABY-240099', customer: 'Yousef Rahman',   total:  890, status: 'Ready for Delivery', date: '2026-04-22' },
    { id: 3,  ref: 'ABY-240098', customer: 'Fatima Al-Nasser',total: 2450, status: 'Accepted',         date: '2026-04-21' },
    { id: 4,  ref: 'ABY-240097', customer: 'Omar Khalid',     total:  320, status: 'Cancelled',        date: '2026-04-21' },
    { id: 5,  ref: 'ABY-240096', customer: 'Layla Hassan',    total: 1890, status: 'Delivered',        date: '2026-04-20' },
    { id: 6,  ref: 'ABY-240095', customer: 'Khalid Al-Sabah', total:  650, status: 'Return Requested', date: '2026-04-19' },
    { id: 7,  ref: 'ABY-240094', customer: 'Noor Abdullah',   total: 1120, status: 'Delivered',        date: '2026-04-19' },
    { id: 8,  ref: 'ABY-240093', customer: 'Hassan Ali',      total:  780, status: 'Refunded',         date: '2026-04-18' },
    { id: 9,  ref: 'ABY-240092', customer: 'Aisha Mohammed',  total: 3200, status: 'Delivered',        date: '2026-04-18' },
    { id: 10, ref: 'ABY-240091', customer: 'Ibrahim Said',    total:  450, status: 'Returned',         date: '2026-04-17' },
    { id: 11, ref: 'ABY-240090', customer: 'Mariam Al-Zahra', total: 2100, status: 'Accepted',         date: '2026-04-16' },
    { id: 12, ref: 'ABY-240089', customer: 'Zaid Rahman',     total:  980, status: 'Delivered',        date: '2026-04-15' },
    { id: 13, ref: 'ABY-240088', customer: 'Huda Al-Amiri',   total:  540, status: 'Ready for Delivery', date: '2026-04-15' },
    { id: 14, ref: 'ABY-240087', customer: 'Salim Khoury',    total: 1750, status: 'Delivered',        date: '2026-04-14' },
  ];

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'Delivered':          return 'ax-badge-success';
      case 'Ready for Delivery': return 'ax-badge-info';
      case 'Accepted':           return 'ax-badge-warning';
      case 'Cancelled':          return 'ax-badge-danger';
      case 'Return Requested':   return 'ax-badge-warning';
      case 'Returned':           return 'ax-badge-neutral';
      case 'Refunded':           return 'ax-badge-brand';
      default:                   return 'ax-badge-neutral';
    }
  }

  onRowClick(row: any): void {
    this.toast.success(`Clicked order ${row.ref}`);
  }

  onSelectionChange(selection: any[]): void {
    this.tableSelection = selection;
  }
}
