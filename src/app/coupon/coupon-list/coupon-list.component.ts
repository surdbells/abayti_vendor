import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TopComponent } from '../../partials/top/top.component';
import { SideComponent } from '../../partials/side/side.component';
import { AsideComponent } from '../../partials/aside/aside.component';
import { TuiButton, TuiIcon, TuiLoader, TuiTitle } from '@taiga-ui/core';
import { CrudService } from '../../services/crud.service';
import { HotToastService } from '@ngneat/hot-toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlobalComponent } from '../../global-component';
import { TUI_CONFIRM } from '@taiga-ui/kit';
import { TuiHeader } from '@taiga-ui/layout';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

interface CouponListItem {
  coupon_id: number;
  code: string;
  name: string;
  discount_type: string;
  discount_value: number;
  max_discount_amount: number | null;
  scope: string;
  max_uses: number | null;
  max_uses_per_customer: number | null;
  times_used: number;
  min_order_amount: number;
  first_order_only: number;
  starts_at: string | null;
  expires_at: string | null;
  status: string;
  store_id: number | null;
  store_name: string;
  created_by_name: string;
  created_at: string;
}

interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

@Component({
  selector: 'app-coupon-list',
  standalone: true,
  imports: [
    TopComponent, SideComponent, AsideComponent,
    TuiIcon, TuiLoader, TuiButton, TuiTitle,
    TuiHeader,
    CommonModule, FormsModule, RouterLink, AsideComponent, SideComponent,
  ],
  templateUrl: './coupon-list.component.html',
  styleUrl: './coupon-list.component.css',
})
export class CouponListComponent implements OnInit, OnDestroy {

  // ── Data ───────────────────────────────────────────────────────
  coupons: CouponListItem[] = [];
  pagination: Pagination = { page: 1, per_page: 10, total: 0, total_pages: 0 };

  // ── UI ─────────────────────────────────────────────────────────
  private readonly dialogs = inject(TuiResponsiveDialogService);
  ui = {
    loading: false,
    no_coupons: false,
    deleting: false,
    toggling: false,
    filters_open: false,
  };

  // ── Session ────────────────────────────────────────────────────
  session_data: any = '';
  user_session = {
    id: 0, token: '', first_name: '', last_name: '',
    email: '', phone: '',
    is_2fa: false, is_active: false, is_admin: false,
    is_vendor: false, is_customer: false,
  };

  // ── Filters ────────────────────────────────────────────────────
  filters = {
    search: '',
    status: '',
    discount_type: '',
  };

  per_page_options = [10, 25, 50];

  // ── Debounced search ───────────────────────────────────────────
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

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

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.pagination.page = 1;
      this.fetchCoupons();
    });

    this.fetchCoupons();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ═══════════════════════════════════════════════════════════════
  //  DATA FETCHING
  // ═══════════════════════════════════════════════════════════════
  fetchCoupons(): void {
    this.ui.loading = true;

    const payload: any = {
      token: this.user_session.token,
      id: this.user_session.id,
      page: this.pagination.page,
      per_page: this.pagination.per_page,
    };

    if (this.filters.search.trim())     payload.search = this.filters.search.trim();
    if (this.filters.status)            payload.status = this.filters.status;
    if (this.filters.discount_type)     payload.discount_type = this.filters.discount_type;

    this.crudService.post_request(payload, GlobalComponent.getCoupons).subscribe({
      next: (response: any) => {
        if (response.response_code === 200 && response.status === 'success') {
          this.coupons = response.data ?? [];
          this.pagination = response.pagination ?? this.pagination;
          this.ui.no_coupons = this.coupons.length === 0;
        } else {
          this.coupons = [];
          this.ui.no_coupons = true;
        }
        this.ui.loading = false;
      },
      error: () => {
        this.toast.error('Unable to fetch coupons.');
        this.ui.loading = false;
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  SEARCH & FILTER
  // ═══════════════════════════════════════════════════════════════
  onSearchInput(): void {
    this.searchSubject.next(this.filters.search);
  }

  applyFilters(): void {
    this.pagination.page = 1;
    this.fetchCoupons();
  }

  clearFilters(): void {
    this.filters = { search: '', status: '', discount_type: '' };
    this.pagination.page = 1;
    this.fetchCoupons();
  }

  get hasActiveFilters(): boolean {
    return !!(this.filters.search || this.filters.status || this.filters.discount_type);
  }

  get activeFilterCount(): number {
    let c = 0;
    if (this.filters.status) c++;
    if (this.filters.discount_type) c++;
    return c;
  }

  toggleFilters(): void {
    this.ui.filters_open = !this.ui.filters_open;
  }

  // ═══════════════════════════════════════════════════════════════
  //  PAGINATION
  // ═══════════════════════════════════════════════════════════════
  goToPage(page: number): void {
    if (page < 1 || page > this.pagination.total_pages) return;
    this.pagination.page = page;
    this.fetchCoupons();
  }

  onPerPageChange(): void {
    this.pagination.page = 1;
    this.fetchCoupons();
  }

  get pageNumbers(): number[] {
    const total = this.pagination.total_pages;
    const current = this.pagination.page;
    const pages: number[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1);
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push(-1);
      pages.push(total);
    }
    return pages;
  }

  // ═══════════════════════════════════════════════════════════════
  //  ACTIONS
  // ═══════════════════════════════════════════════════════════════
  editCoupon(id: number): void {
    this.router.navigate(['/edit-coupon'], { queryParams: { id } });
  }

  viewAnalytics(id: number): void {
    this.router.navigate(['/coupon-analytics'], { queryParams: { id } });
  }

  // ── Toggle status ──────────────────────────────────────────────
  toggleStatus(coupon: CouponListItem): void {
    const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'activate' : 'deactivate';

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: `Confirm ${label}`,
        data: {
          content: `Are you sure you want to ${label} coupon "${coupon.code}"?`,
          yes: label.charAt(0).toUpperCase() + label.slice(1),
          no: 'Cancel',
        },
      })
      .subscribe((ok) => {
        if (ok) this.executeToggle(coupon.coupon_id, newStatus);
      });
  }

  private executeToggle(couponId: number, status: string): void {
    this.ui.toggling = true;
    const payload = {
      token: this.user_session.token,
      id: this.user_session.id,
      coupon_id: couponId,
      status,
    };

    this.crudService.post_request(payload, GlobalComponent.toggleCouponStatus).subscribe({
      next: (response: any) => {
        this.ui.toggling = false;
        if (response.response_code === 200 && response.status === 'success') {
          this.toast.success(response.message);
          this.fetchCoupons();
        } else {
          this.toast.error(response.message);
        }
      },
      error: () => {
        this.ui.toggling = false;
        this.toast.error('Unable to update coupon status.');
      },
    });
  }

  // ── Delete ─────────────────────────────────────────────────────
  startDelete(coupon: CouponListItem): void {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirm delete',
        data: {
          content: `Coupon "${coupon.code}" will be deleted permanently. Usage history will be preserved.`,
          yes: 'Delete',
          no: 'Cancel',
        },
      })
      .subscribe((ok) => {
        if (ok) this.executeDelete(coupon.coupon_id);
      });
  }

  private executeDelete(couponId: number): void {
    this.ui.deleting = true;
    const payload = {
      token: this.user_session.token,
      id: this.user_session.id,
      coupon_id: couponId,
    };

    this.crudService.post_request(payload, GlobalComponent.deleteCoupon).subscribe({
      next: (response: any) => {
        this.ui.deleting = false;
        if (response.response_code === 200 && response.status === 'success') {
          this.toast.success('Coupon deleted successfully.');
          this.fetchCoupons();
        } else {
          this.toast.error(response.message);
        }
      },
      error: () => {
        this.ui.deleting = false;
        this.toast.error('Unable to delete coupon.');
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  UTILITIES
  // ═══════════════════════════════════════════════════════════════
  trackById = (_: number, item: CouponListItem) => item.coupon_id;

  getDiscountLabel(c: CouponListItem): string {
    switch (c.discount_type) {
      case 'percentage':
        const cap = c.max_discount_amount ? ` (max AED ${c.max_discount_amount})` : '';
        return `${c.discount_value}% off${cap}`;
      case 'fixed_amount':
        return `AED ${c.discount_value} off`;
      case 'free_shipping':
        return 'Free Shipping';
      default:
        return '';
    }
  }

  getDiscountTypeBadge(type: string): string {
    switch (type) {
      case 'percentage': return 'badge-type-percentage';
      case 'fixed_amount': return 'badge-type-fixed';
      case 'free_shipping': return 'badge-type-shipping';
      default: return '';
    }
  }

  getDiscountTypeLabel(type: string): string {
    switch (type) {
      case 'percentage': return 'Percentage';
      case 'fixed_amount': return 'Fixed';
      case 'free_shipping': return 'Free Shipping';
      default: return type;
    }
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'active': return 'badge-status-active';
      case 'inactive': return 'badge-status-inactive';
      case 'expired': return 'badge-status-expired';
      default: return '';
    }
  }

  getUsageText(c: CouponListItem): string {
    if (c.max_uses) {
      return `${c.times_used} / ${c.max_uses}`;
    }
    return `${c.times_used} / ∞`;
  }

  getUsagePercent(c: CouponListItem): number {
    if (!c.max_uses) return 0;
    return Math.min(100, Math.round((c.times_used / c.max_uses) * 100));
  }

  isExpired(c: CouponListItem): boolean {
    if (!c.expires_at) return false;
    return new Date(c.expires_at) < new Date();
  }

  isScheduled(c: CouponListItem): boolean {
    if (!c.starts_at) return false;
    return new Date(c.starts_at) > new Date();
  }

  goBack(): void {
    if (this.user_session.is_vendor) this.router.navigate(['/account']);
    if (this.user_session.is_admin) this.router.navigate(['/backend']);
  }
}
