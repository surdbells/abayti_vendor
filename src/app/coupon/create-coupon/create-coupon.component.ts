import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SideComponent } from '../../partials/side/side.component';
import { AsideComponent } from '../../partials/aside/aside.component';
import { TopComponent } from '../../partials/top/top.component';
import { TuiIcon, TuiLoader } from '@taiga-ui/core';
import { CrudService } from '../../services/crud.service';
import { HotToastService } from '@ngneat/hot-toast';
import { GlobalComponent } from '../../global-component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TUI_CONFIRM } from '@taiga-ui/kit';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Category } from '../../class/category';

@Component({
  selector: 'app-create-coupon',
  standalone: true,
  imports: [
    SideComponent, AsideComponent, TopComponent,
    TuiIcon, TuiLoader, CommonModule, FormsModule,
    NgMultiSelectDropDownModule, SideComponent, AsideComponent,
  ],
  templateUrl: './create-coupon.component.html',
  styleUrl: './create-coupon.component.css',
})
export class CreateCouponComponent implements OnInit {

  private readonly dialogs = inject(TuiResponsiveDialogService);

  // ── Session ────────────────────────────────────────────────────
  session_data: any = '';
  user_session = {
    id: 0, token: '', first_name: '', last_name: '',
    email: '', phone: '',
    is_2fa: false, is_active: false, is_admin: false,
    is_vendor: false, is_customer: false,
  };

  // ── UI ─────────────────────────────────────────────────────────
  ui = { loading: false, page_loading: false, generating_code: false };

  // ── Form model ─────────────────────────────────────────────────
  form = {
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount' | 'free_shipping',
    discount_value: 0,
    max_discount_amount: null as number | null,
    scope: 'all_products' as 'all_products' | 'specific_products' | 'specific_categories',
    max_uses: null as number | null,
    max_uses_per_customer: 1,
    min_order_amount: 0,
    first_order_only: false,
    starts_at: '',
    expires_at: '',
  };

  // ── Admin: coupon creation mode ────────────────────────────────
  coupon_mode: 'platform' | 'as_vendor' = 'platform';
  assign_to_store: number | null = null;

  // ── Lookup data ────────────────────────────────────────────────
  categories: Category[] = [];
  products: { id: number; name: string }[] = [];
  stores: { id: number; store_name: string }[] = [];

  // ── Multi-select targets ───────────────────────────────────────
  selectedProducts: { id: number; name: string }[] = [];
  selectedCategories: { id: number; name: string }[] = [];
  selectedStores: { id: number; store_name: string }[] = [];

  productDropdownSettings: any = {};
  categoryDropdownSettings: any = {};
  storeDropdownSettings: any = {};

  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}

  // ═══════════════════════════════════════════════════════════════
  //  LIFECYCLE
  // ═══════════════════════════════════════════════════════════════
  ngOnInit(): void {
    this.session_data = sessionStorage.getItem('SESSION');
    this.user_session = GlobalComponent.decodeBase64(this.session_data);

    this.productDropdownSettings = {
      singleSelection: false, idField: 'id', textField: 'name',
      selectAllText: 'Select All', unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3, allowSearchFilter: true,
    };
    this.categoryDropdownSettings = {
      singleSelection: false, idField: 'id', textField: 'name',
      selectAllText: 'Select All', unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3, allowSearchFilter: true,
    };
    this.storeDropdownSettings = {
      singleSelection: false, idField: 'id', textField: 'store_name',
      selectAllText: 'Select All', unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3, allowSearchFilter: true,
    };

    this.fetchLookupData();
  }

  // ═══════════════════════════════════════════════════════════════
  //  DATA LOADING
  // ═══════════════════════════════════════════════════════════════
  fetchLookupData(): void {
    this.ui.page_loading = true;

    // Categories
    this.crudService.get_request(GlobalComponent.UtilityCategory).subscribe({
      next: (r: any) => {
        if (r.response_code === 200 && r.status === 'success') {
          this.categories = (r.data || []).map((c: any) => ({ id: c.id ?? c.category_id, name: c.name ?? c.category_name }));
        }
      },
    });

    // Products (vendor's own)
    if (this.user_session.is_vendor) {
      const payload = { token: this.user_session.token, id: this.user_session.id, store: this.user_session.id };
      this.crudService.post_request(payload, GlobalComponent.getProduct).subscribe({
        next: (r: any) => {
          if (r.response_code === 200 && r.status === 'success') {
            this.products = (r.data || []).map((p: any) => ({ id: p.id, name: p.name }));
          }
          this.ui.page_loading = false;
        },
      });
    }

    // Stores (admin only)
    if (this.user_session.is_admin) {
      this.crudService.get_request(GlobalComponent.UtilityStores).subscribe({
        next: (r: any) => {
          if (r.response_code === 200 && r.status === 'success') {
            this.stores = (r.data || []).map((s: any) => ({ id: s.user_id ?? s.id, store_name: s.store_name }));
          }
          this.ui.page_loading = false;
        },
      });
    }

    if (!this.user_session.is_vendor && !this.user_session.is_admin) {
      this.ui.page_loading = false;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  CODE GENERATION
  // ═══════════════════════════════════════════════════════════════
  generateCode(): void {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.form.code = code;
  }

  // ═══════════════════════════════════════════════════════════════
  //  VALIDATION
  // ═══════════════════════════════════════════════════════════════
  private validate(): boolean {
    if (!this.form.name.trim()) { this.toast.error('Coupon name is required.'); return false; }
    if (this.form.discount_type !== 'free_shipping' && this.form.discount_value <= 0) {
      this.toast.error('Discount value must be greater than 0.'); return false;
    }
    if (this.form.discount_type === 'percentage' && this.form.discount_value > 100) {
      this.toast.error('Percentage cannot exceed 100%.'); return false;
    }
    if (this.form.expires_at && this.form.starts_at && new Date(this.form.expires_at) <= new Date(this.form.starts_at)) {
      this.toast.error('Expiry date must be after start date.'); return false;
    }
    return true;
  }

  // ═══════════════════════════════════════════════════════════════
  //  SUBMIT
  // ═══════════════════════════════════════════════════════════════
  startCreate(): void {
    if (!this.validate()) return;

    // Admin "as vendor" validation
    if (this.user_session.is_admin && this.coupon_mode === 'as_vendor' && !this.assign_to_store) {
      this.toast.error('Please select a store to assign this coupon to.');
      return;
    }

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Create coupon',
        data: {
          content: `Create coupon "${this.form.code || '(auto-generated)'}" and make it active immediately?`,
          yes: 'Create', no: 'Cancel',
        },
      })
      .subscribe((ok) => { if (ok) this.submitCoupon(); });
  }

  private submitCoupon(): void {
    this.ui.loading = true;

    // Build targets
    const target_products: any[] = [];
    if (this.form.scope === 'specific_products') {
      for (const p of this.selectedProducts) {
        target_products.push({ target_type: 'product', target_id: p.id });
      }
    }
    if (this.form.scope === 'specific_categories') {
      for (const c of this.selectedCategories) {
        target_products.push({ target_type: 'category', target_id: c.id });
      }
    }

    const target_stores = this.selectedStores.map(s => s.id);

    const payload: any = {
      token: this.user_session.token,
      id: this.user_session.id,
      code: this.form.code || '',
      name: this.form.name,
      description: this.form.description,
      discount_type: this.form.discount_type,
      discount_value: this.form.discount_type === 'free_shipping' ? 0 : this.form.discount_value,
      max_discount_amount: this.form.max_discount_amount,
      scope: this.form.scope,
      max_uses: this.form.max_uses,
      max_uses_per_customer: this.form.max_uses_per_customer,
      min_order_amount: this.form.min_order_amount,
      first_order_only: this.form.first_order_only ? 1 : 0,
      starts_at: this.form.starts_at || null,
      expires_at: this.form.expires_at || null,
      target_products,
      target_stores,
    };

    // Admin mode fields
    if (this.user_session.is_admin) {
      payload.coupon_mode = this.coupon_mode;
      if (this.coupon_mode === 'as_vendor' && this.assign_to_store) {
        payload.assign_to_store = this.assign_to_store;
      }
    }

    this.crudService.post_request(payload, GlobalComponent.createCoupon).subscribe({
      next: (response: any) => {
        this.ui.loading = false;
        if (response.response_code === 200 && response.status === 'success') {
          this.toast.success(response.message);
          this.router.navigate(['/coupons']);
        } else {
          this.toast.error(response.message);
        }
      },
      error: () => {
        this.ui.loading = false;
        this.toast.error('Unable to create coupon.');
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  MULTI-SELECT HANDLERS
  // ═══════════════════════════════════════════════════════════════
  onItemSelect(_: any): void {}
  onSelectAll(_: any): void {}

  // ═══════════════════════════════════════════════════════════════
  //  NAVIGATION
  // ═══════════════════════════════════════════════════════════════
  goBack(): void {
    this.router.navigate(['/coupons']);
  }
}
