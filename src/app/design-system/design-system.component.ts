import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AxMultiselectComponent,
  AxMultiselectOption,
  AxComboboxComponent,
  AxComboboxOption,
  AxDatePickerComponent,
  AxDateRange,
} from '../shared/forms';

/**
 * Design-system demo — exercises every Phase 2 form control.
 * Temporary route, removed in Phase 11.
 * Visit /design-system (no auth) while reviewing Phase 2.
 */
@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AxMultiselectComponent,
    AxComboboxComponent,
    AxDatePickerComponent,
  ],
  templateUrl: './design-system.component.html',
})
export class DesignSystemComponent {
  // Form state
  categoryIds: (string | number)[] = ['electronics'];
  countryId: string | number | null = 'ae';
  singleDate: Date | null = null;
  dateRange: AxDateRange | null = null;

  // Control states
  notifications = true;
  marketing = false;
  shipping = 'standard';
  agreeToTerms = false;
  indeterminateDemo = false;
  quantity = 50;

  // Dropdown data
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
    { id: 'ma', label: 'Morocco' },
    { id: 'tn', label: 'Tunisia' },
    { id: 'ng', label: 'Nigeria' },
    { id: 'gh', label: 'Ghana' },
    { id: 'ke', label: 'Kenya' },
    { id: 'za', label: 'South Africa' },
    { id: 'gb', label: 'United Kingdom' },
    { id: 'us', label: 'United States' },
  ];

  onIndeterminateClick(input: HTMLInputElement) {
    input.indeterminate = true;
  }
}
