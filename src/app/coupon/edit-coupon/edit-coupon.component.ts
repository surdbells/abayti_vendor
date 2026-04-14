import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-edit-coupon',
  standalone: true,
  imports: [
    SideComponent, AsideComponent, TopComponent,
    TuiIcon, TuiLoader, CommonModule, FormsModule,
    NgMultiSelectDropDownModule, SideComponent, AsideComponent,
  ],
  templateUrl: './edit-coupon.component.html',
  styleUrl: './edit-coupon.component.css',
})
export class EditCouponComponent implements OnInit {

  private readonly dialogs = inject(TuiResponsiveDialogService);

  session_data: any = '';
  user_session = {
    id: 0, token: '', first_name: '', last_name: '',
    email: '', phone: '',
    is_2fa: false, is_active: false, is_admin: false,
    is_vendor: false, is_customer: false,
  };

  ui = { loading: false, page_loading: true };

  coupon_id = 0;
  coupon_code = ''; // Read-only — cannot change code after creation

  form = {
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
    status: 'active',
  };

  // ── Admin: coupon mode (read from existing data) ───────────────
  coupon_mode: 'platform' | 'as_vendor' = 'platform';
  assign_to_store: number | null = null;
  original_store_id: number | null = null; // Track original for display

  // Stats (read-only display)
  stats = {
    total_uses: 0,
    unique_customers: 0,
    total_discount_given: 0,
    total_revenue_generated: 0,
  };

  // Lookups
  categories: Category[] = [];
  products: { id: number; name: string }[] = [];
  stores: { id: number; store_name: string }[] = [];

  selectedProducts: { id: number; name: string }[] = [];
  selectedCategories: { id: number; name: string }[] = [];
  selectedStores: { id: number; store_name: string }[] = [];

  productDropdownSettings: any = {};
  categoryDropdownSettings: any = {};
  storeDropdownSettings: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}

  ngOnInit(): void {
    this.session_data = sessionStorage.getItem('SESSION');
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    this.coupon_id = Number(this.route.snapshot.queryParamMap.get('id'));

    this.productDropdownSettings = {
      singleSelection: false, idField: 'id', textField: 'name',
      selectAllText: 'Select All', unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3, allowSearchFilter: true,
    };
    this.categoryDropdownSettings = { ...this.productDropdownSettings };
    this.storeDropdownSettings = {
      singleSelection: false, idField: 'id', textField: 'store_name',
      selectAllText: 'Select All', unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3, allowSearchFilter: true,
    };

    this.fetchCoupon();
    this.fetchLookupData();
  }

  // ═══════════════════════════════════════════════════════════════
  //  DATA LOADING
  // ═══════════════════════════════════════════════════════════════
  fetchCoupon(): void {
    const payload = {
      token: this.user_session.token,
      id: this.user_session.id,
      coupon_id: this.coupon_id,
    };

    this.crudService.post_request(payload, GlobalComponent.getCouponById).subscribe({
      next: (response: any) => {
        if (response.response_code === 200 && response.status === 'success') {
          const d = response.data;
          this.coupon_code = d.code;

          this.form.name = d.name;
          this.form.description = d.description || '';
          this.form.discount_type = d.discount_type;
          this.form.discount_value = d.discount_value;
          this.form.max_discount_amount = d.max_discount_amount;
          this.form.scope = d.scope;
          this.form.max_uses = d.max_uses;
          this.form.max_uses_per_customer = d.max_uses_per_customer ?? 1;
          this.form.min_order_amount = d.min_order_amount;
          this.form.first_order_only = !!d.first_order_only;
          this.form.starts_at = d.starts_at ? this.toDatetimeLocal(d.starts_at) : '';
          this.form.expires_at = d.expires_at ? this.toDatetimeLocal(d.expires_at) : '';
          this.form.status = d.status;

          // Stats
          if (d.stats) {
            this.stats = d.stats;
          }

          // Targets
          const targets = d.target_products || [];
          this.selectedProducts = targets.filter((t: any) => t.target_type === 'product').map((t: any) => ({ id: t.target_id, name: `Product #${t.target_id}` }));
          this.selectedCategories = targets.filter((t: any) => t.target_type === 'category').map((t: any) => ({ id: t.target_id, name: `Category #${t.target_id}` }));

          // Stores
          this.selectedStores = (d.target_stores || []).map((s: any) => ({ id: s.store_id, store_name: s.store_name || `Store #${s.store_id}` }));

          // Determine coupon mode for admin
          this.original_store_id = d.store_id;
          if (d.created_by_role === 'admin' && d.store_id !== null) {
            // Admin created this "as vendor" — it has a direct store_id
            this.coupon_mode = 'as_vendor';
            this.assign_to_store = d.store_id;
          } else if (d.created_by_role === 'admin') {
            this.coupon_mode = 'platform';
          }

          this.ui.page_loading = false;
        } else {
          this.toast.error('Coupon not found.');
          this.router.navigate(['/coupons']);
        }
      },
      error: () => {
        this.toast.error('Unable to load coupon.');
        this.router.navigate(['/coupons']);
      },
    });
  }

  fetchLookupData(): void {
    this.crudService.get_request(GlobalComponent.UtilityCategory).subscribe({
      next: (r: any) => {
        if (r.response_code === 200 && r.status === 'success') {
          this.categories = (r.data || []).map((c: any) => ({ id: c.id ?? c.category_id, name: c.name ?? c.category_name }));
          // Re-map selected category names
          this.selectedCategories = this.selectedCategories.map(sc => {
            const found = this.categories.find((c: any) => c.id === sc.id);
            return found ? { id: found.id, name: (found as any).name } : sc;
          });
        }
      },
    });

    if (this.user_session.is_vendor) {
      const payload = { token: this.user_session.token, id: this.user_session.id, store: this.user_session.id };
      this.crudService.post_request(payload, GlobalComponent.getProduct).subscribe({
        next: (r: any) => {
          if (r.response_code === 200 && r.status === 'success') {
            this.products = (r.data || []).map((p: any) => ({ id: p.id, name: p.name }));
            // Re-map selected product names
            this.selectedProducts = this.selectedProducts.map(sp => {
              const found = this.products.find(p => p.id === sp.id);
              return found ? found : sp;
            });
          }
        },
      });
    }

    if (this.user_session.is_admin) {
      this.crudService.get_request(GlobalComponent.UtilityStores).subscribe({
        next: (r: any) => {
          if (r.response_code === 200 && r.status === 'success') {
            this.stores = (r.data || []).map((s: any) => ({ id: s.user_id ?? s.id, store_name: s.store_name }));
            this.selectedStores = this.selectedStores.map(ss => {
              const found = this.stores.find(s => s.id === ss.id);
              return found ? found : ss;
            });
          }
        },
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  SUBMIT
  // ═══════════════════════════════════════════════════════════════
  private validate(): boolean {
    if (!this.form.name.trim()) { this.toast.error('Coupon name is required.'); return false; }
    if (this.form.discount_type !== 'free_shipping' && this.form.discount_value <= 0) {
      this.toast.error('Discount value must be greater than 0.'); return false;
    }
    if (this.form.discount_type === 'percentage' && this.form.discount_value > 100) {
      this.toast.error('Percentage cannot exceed 100%.'); return false;
    }
    return true;
  }

  startUpdate(): void {
    if (!this.validate()) return;

    if (this.user_session.is_admin && this.coupon_mode === 'as_vendor' && !this.assign_to_store) {
      this.toast.error('Please select a store to assign this coupon to.');
      return;
    }

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Save changes',
        data: {
          content: 'Update this coupon? Changes take effect immediately.',
          yes: 'Save', no: 'Cancel',
        },
      })
      .subscribe((ok) => { if (ok) this.submitUpdate(); });
  }

  private submitUpdate(): void {
    this.ui.loading = true;

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

    const payload: any = {
      token: this.user_session.token,
      id: this.user_session.id,
      coupon_id: this.coupon_id,
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
      status: this.form.status,
      target_products,
      target_stores: this.selectedStores.map(s => s.id),
    };

    // Admin mode fields
    if (this.user_session.is_admin) {
      payload.coupon_mode = this.coupon_mode;
      if (this.coupon_mode === 'as_vendor' && this.assign_to_store) {
        payload.assign_to_store = this.assign_to_store;
      }
    }

    this.crudService.post_request(payload, GlobalComponent.updateCoupon).subscribe({
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
        this.toast.error('Unable to update coupon.');
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  UTILITIES
  // ═══════════════════════════════════════════════════════════════
  private toDatetimeLocal(dt: string): string {
    if (!dt) return '';
    const d = new Date(dt);
    return d.toISOString().slice(0, 16);
  }

  onItemSelect(_: any): void {}
  onSelectAll(_: any): void {}

  goBack(): void {
    this.router.navigate(['/coupons']);
  }
}
