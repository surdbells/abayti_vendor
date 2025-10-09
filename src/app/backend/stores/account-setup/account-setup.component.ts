import { Component, Input, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiIcon} from '@taiga-ui/core';

@Component({
  selector: 'app-account-setup',
  templateUrl: './account-setup.component.html',
  standalone: true,
  imports: [CommonModule, TuiIcon],
  styleUrls: ['./account-setup.component.css']
})
export class AccountSetupComponent implements OnInit {
  // provide the object via Input or set it directly
  @Input() profile: any = null;

  // optional: explicitly list fields you consider required. If left empty, we'll use all keys except id & token.
  @Input() requiredFields: string[] = [];

  fields: { key: string; label: string; value: any; filled: boolean }[] = [];
  total = 0;
  filledCount = 0;
  percent = 0;

  ngOnInit(): void {
    // fallback sample if none provided (you can remove this to force Input usage)
    this.initFields();
    this.calculateProgress();
  }

  private initFields() {
    let keys: string[] = [];
    if (this.requiredFields && this.requiredFields.length > 0) {
      keys = this.requiredFields;
    } else {
      keys = Object.keys(this.profile).filter(k => k !== 'id' && k !== 'token');
    }
    // friendly labels mapping (fallback to key when absent)
    const labels: Record<string, string> = {
      first_name: 'First Name',
      last_name: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      avatar: 'Avatar',
      id_front: 'ID (Front)',
      id_back: 'ID (Back)',
      license_doc: 'License Document',
      vat_status: 'VAT Status',
      store_legal_name: 'Store Legal Name',
      trade_license_number: 'Trade License No.',
      licensing_authority: 'Licensing Authority',
      tax_registration_number: 'Tax Reg. No.',
      vat_registration_effective_date: 'VAT Reg. Effective Date',
      registered_tax_address: 'Registered Tax Address',
      tax_contact_email: 'Tax Contact Email',
      store_address: 'Store Address',
      store_bank_name: 'Bank Name',
      store_account_name: 'Account Name',
      store_account_number: 'Account Number',
      last_login: 'Last Login'
    };

    this.fields = keys.map(k => {
      const v = this.profile[k];
      const filled = this.isFilled(v);
      return { key: k, label: labels[k] || this.humanize(k), value: v, filled };
    });
  }

  private isFilled(value: any): boolean {
    // treat non-empty strings, non-null, non-undefined, and arrays/objects with content as filled
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    // numbers and booleans count as filled
    return true;
  }

  private calculateProgress() {
    this.total = this.fields.length;
    this.filledCount = this.fields.filter(f => f.filled).length;

    // compute percentage safely (digit-by-digit in code arithmetic)
    if (this.total === 0) {
      this.percent = 0;
    } else {
      this.percent = Math.round((this.filledCount / this.total) * 100);
    }
  }

  // convenience to show a readable fallback value
  displayValue(field: any) {
    if (!field.filled) return '— not provided —';
    if (typeof field.value === 'string' && (field.key.includes('avatar') || field.key.includes('id_') || field.key.includes('license_doc'))) {
      return field.value;
    }
    if (typeof field.value === 'string' && (field.key.includes('store_description'))) {
      return "description provided";
    }
    return field.value;
  }

  private humanize(key: string) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
