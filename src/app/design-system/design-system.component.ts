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
}
