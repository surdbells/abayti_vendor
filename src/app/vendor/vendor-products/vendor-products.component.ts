import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TopComponent } from '../../partials/top/top.component';
import { SideComponent } from '../../partials/side/side.component';
import { AsideComponent } from '../../partials/aside/aside.component';
import { TuiButton, TuiIcon, TuiLoader, TuiPopup, TuiTitle } from '@taiga-ui/core';
import { CrudService } from '../../services/crud.service';
import { HotToastService } from '@ngneat/hot-toast';
import { FormsModule } from '@angular/forms';
import { CommonModule, formatCurrency } from '@angular/common';
import { GlobalComponent } from '../../global-component';
import { Products } from '../../class/products';
import { TUI_CONFIRM, TuiDrawer } from '@taiga-ui/kit';
import { TuiHeader } from '@taiga-ui/layout';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

// ── Color map for preview drawer ─────────────────────────────────
const COLOR_HEX_MAP: Record<string, string> = {
  'black': '#000000', 'white': '#FFFFFF', 'off-white': '#FAF9F6',
  'charcoal': '#333333', 'gray': '#808080', 'light-gray': '#D3D3D3',
  'beige': '#F5F5DC', 'tan': '#D2B48C', 'camel': '#C19A6B',
  'brown': '#8B4513', 'chocolate': '#5D3A00', 'navy': '#001F3F',
  'blue': '#1F75FE', 'light-blue': '#87CEEB', 'sky-blue': '#00BFFF',
  'denim': '#274472', 'teal': '#008080', 'aqua': '#00FFFF',
  'mint': '#98FF98', 'green': '#2E8B57', 'lime': '#32CD32',
  'olive': '#808000', 'forest': '#228B22', 'red': '#C0392B',
  'crimson': '#DC143C', 'burgundy': '#800020', 'pink': '#FFC0CB',
  'hot-pink': '#FF69B4', 'rose': '#FF007F', 'purple': '#800080',
  'lavender': '#E6E6FA', 'violet': '#8A2BE2', 'orange': '#FF8C00',
  'peach': '#FFDAB9', 'coral': '#FF7F50', 'yellow': '#FFD200',
  'mustard': '#FFDB58', 'gold': '#D4AF37', 'silver': '#C0C0C0',
  'bronze': '#CD7F32', 'champagne': '#F7E7CE', 'ivory': '#FFFFF0',
};

interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ProductListItem {
  id: number;
  store: number;
  category: string;
  category_id: number;
  image: string;
  name: string;
  price: number;
  price_formatted: string;
  quantity: number;
  stock_status: string;
  label: string;
  status: string;
  created: string;
  updated: string;
  store_name: string;
}

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  imports: [
    TopComponent,
    SideComponent,
    AsideComponent,
    TuiIcon,
    CommonModule,
    FormsModule,
    RouterLink,
    TuiLoader,
    TuiDrawer,
    TuiHeader,
    TuiTitle,
    TuiPopup,
    TuiButton,
  ],
  templateUrl: './vendor-products.component.html',
  styleUrl: './vendor-products.component.css',
})
export class VendorProductsComponent implements OnInit, OnDestroy {

  // ── Product data ───────────────────────────────────────────────
  products: ProductListItem[] = [];
  pagination: Pagination = { page: 1, per_page: 10, total: 0, total_pages: 0 };

  // ── Preview drawer ─────────────────────────────────────────────
  protected readonly open = signal(false);
  private readonly dialogs = inject(TuiResponsiveDialogService);
  image_url = 'https://api.3bayti.ae/vendors/products/';
  single_product: any = {
    id: 0, token: '', product: 0, store: 0, category: 0, category_name: '',
    name: '', description: '',
    image_1: 'assets/img/placeholder-1.png', images: [] as string[],
    quantity: 0, allow_checkout_when_out_of_stock: false,
    with_storehouse_management: false, stock_status: 'in_stock',
    price: 0, minimum_order_quantity: 1, maximum_order_quantity: 1,
    cost_per_item: 0, delivery_time: '', custom_delivery_time: '',
    size_xs: false, size_s: false, size_m: false, size_l: false,
    size_xl: false, size_xxl: false, size_50: false, size_52: false,
    size_54: false, size_56: false, size_58: false, size_60: false,
    size_62: false, size_custom: false, require_extra_msmt: false,
    extra_msmt: '', is_hot: false, is_new: false, is_sale: false,
    delivery_note: '', colors: '', label: 0,
  };
  previewImageIndex = 0;

  // ── UI controls ────────────────────────────────────────────────
  ui = {
    loading: false,
    no_products: false,
    loaded_preview: false,
    list_view: true,
    grid_view: false,
    deleting: false,
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
    stock_status: '',
    category_id: null as number | null,
    price_min: null as number | null,
    price_max: null as number | null,
  };
  price_preset = ''; // for predefined price ranges
  categories: { id: number; name: string }[] = [];

  // ── Per-page options ───────────────────────────────────────────
  per_page_options = [10, 25, 50, 100];

  // ── Debounced search ───────────────────────────────────────────
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // ── Delete payload ─────────────────────────────────────────────
  private delete_payload = { id: 0, product: 0, token: '', name: '' };

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

    this.delete_payload.token = this.user_session.token;
    this.delete_payload.id = this.user_session.id;

    // Debounce search input
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.pagination.page = 1;
      this.fetchProducts();
    });

    this.fetchCategories();
    this.fetchProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ═══════════════════════════════════════════════════════════════
  //  DATA FETCHING
  // ═══════════════════════════════════════════════════════════════
  fetchProducts(): void {
    this.ui.loading = true;

    const payload: any = {
      token: this.user_session.token,
      id: this.user_session.id,
      store: this.user_session.id,
      page: this.pagination.page,
      per_page: this.pagination.per_page,
    };

    // Attach active filters
    if (this.filters.search.trim())        payload.search = this.filters.search.trim();
    if (this.filters.status)               payload.status = this.filters.status;
    if (this.filters.stock_status)         payload.stock_status = this.filters.stock_status;
    if (this.filters.category_id)          payload.category_id = this.filters.category_id;
    if (this.filters.price_min !== null)   payload.price_min = this.filters.price_min;
    if (this.filters.price_max !== null)   payload.price_max = this.filters.price_max;

    this.crudService.post_request(payload, GlobalComponent.getProduct).subscribe({
      next: (response: any) => {
        if (response.response_code === 200 && response.status === 'success') {
          this.products = response.data ?? [];
          this.pagination = response.pagination ?? this.pagination;
          this.ui.no_products = this.products.length === 0;
        } else {
          this.products = [];
          this.ui.no_products = true;
        }
        this.ui.loading = false;
      },
      error: () => {
        this.toast.error('Unable to complete your request at this time.');
        this.ui.loading = false;
      },
    });
  }

  fetchCategories(): void {
    this.crudService.get_request(GlobalComponent.UtilityCategory).subscribe({
      next: (response: any) => {
        if (response.response_code === 200 && response.status === 'success') {
          this.categories = (response.data || []).map((c: any) => ({
            id: c.id ?? c.category_id,
            name: c.name ?? c.category_name,
          }));
        }
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  SEARCH & FILTER HANDLERS
  // ═══════════════════════════════════════════════════════════════
  onSearchInput(): void {
    this.searchSubject.next(this.filters.search);
  }

  applyFilters(): void {
    this.pagination.page = 1;
    this.fetchProducts();
  }

  clearFilters(): void {
    this.filters = {
      search: '', status: '', stock_status: '',
      category_id: null, price_min: null, price_max: null,
    };
    this.price_preset = '';
    this.pagination.page = 1;
    this.fetchProducts();
  }

  onPricePresetChange(): void {
    switch (this.price_preset) {
      case 'under_100':
        this.filters.price_min = null;
        this.filters.price_max = 100;
        break;
      case '100_300':
        this.filters.price_min = 100;
        this.filters.price_max = 300;
        break;
      case '300_500':
        this.filters.price_min = 300;
        this.filters.price_max = 500;
        break;
      case '500_plus':
        this.filters.price_min = 500;
        this.filters.price_max = null;
        break;
      case 'custom':
        // Let user type custom values
        this.filters.price_min = null;
        this.filters.price_max = null;
        break;
      default:
        this.filters.price_min = null;
        this.filters.price_max = null;
    }
    if (this.price_preset !== 'custom') {
      this.applyFilters();
    }
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.filters.search || this.filters.status || this.filters.stock_status ||
      this.filters.category_id || this.filters.price_min !== null || this.filters.price_max !== null
    );
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filters.status) count++;
    if (this.filters.stock_status) count++;
    if (this.filters.category_id) count++;
    if (this.filters.price_min !== null || this.filters.price_max !== null) count++;
    return count;
  }

  // ═══════════════════════════════════════════════════════════════
  //  PAGINATION HANDLERS
  // ═══════════════════════════════════════════════════════════════
  goToPage(page: number): void {
    if (page < 1 || page > this.pagination.total_pages) return;
    this.pagination.page = page;
    this.fetchProducts();
  }

  onPerPageChange(): void {
    this.pagination.page = 1;
    this.fetchProducts();
  }

  get pageNumbers(): number[] {
    const total = this.pagination.total_pages;
    const current = this.pagination.page;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1); // ellipsis
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push(-1); // ellipsis
      pages.push(total);
    }
    return pages;
  }

  // ═══════════════════════════════════════════════════════════════
  //  VIEW TOGGLE
  // ═══════════════════════════════════════════════════════════════
  switchGrid(): void {
    this.ui.list_view = false;
    this.ui.grid_view = true;
  }

  switchList(): void {
    this.ui.list_view = true;
    this.ui.grid_view = false;
  }

  toggleFilters(): void {
    this.ui.filters_open = !this.ui.filters_open;
  }

  // ═══════════════════════════════════════════════════════════════
  //  PRODUCT ACTIONS
  // ═══════════════════════════════════════════════════════════════
  editProduct(id: number): void {
    this.router.navigate(['/', 'edit'], { queryParams: { id } });
  }

  productSales(id: number, name: string): void {
    localStorage.setItem('PRODUCT_ID', String(id));
    localStorage.setItem('PRODUCT_NAME', name);
    this.router.navigate(['/product_sales']);
  }

  // ── Preview ────────────────────────────────────────────────────
  preview(id: number): void {
    this.open.set(true);
    this.ui.loaded_preview = false;
    this.previewImageIndex = 0;

    const payload = {
      token: this.user_session.token,
      id: this.user_session.id,
      product: id,
    };

    this.crudService.post_request(payload, GlobalComponent.getProductById).subscribe({
      next: (response: any) => {
        if (response.response_code === 200 && response.status === 'success') {
          this.single_product = response.data;
          this.ui.loaded_preview = true;
        }
      },
    });
  }

  // Preview image navigation
  get previewImages(): string[] {
    const imgs: string[] = [];
    if (this.single_product.image_1) imgs.push(this.single_product.image_1);
    if (this.single_product.images && Array.isArray(this.single_product.images)) {
      for (const src of this.single_product.images) {
        if (src && !src.includes('placeholder')) imgs.push(src);
      }
    }
    return imgs;
  }

  getImageUrl(src: string): string {
    if (!src) return 'assets/img/placeholder-1.png';
    return src.length > 100 ? src : this.image_url + src;
  }

  prevImage(): void {
    if (this.previewImageIndex > 0) this.previewImageIndex--;
  }

  nextImage(): void {
    if (this.previewImageIndex < this.previewImages.length - 1) this.previewImageIndex++;
  }

  selectImage(index: number): void {
    this.previewImageIndex = index;
  }

  // Preview helper: get colors as array of {id, hex}
  get previewColors(): { id: string; hex: string }[] {
    if (!this.single_product.colors) return [];
    return this.single_product.colors.split(',').map((c: string) => c.trim()).filter(Boolean)
      .map((id: string) => ({ id, hex: COLOR_HEX_MAP[id] || '#CCCCCC' }));
  }

  // Preview helper: get active sizes
  get previewSizes(): string[] {
    const sizes: string[] = [];
    const sizeMap: Record<string, string> = {
      size_xs: 'XS', size_s: 'S', size_m: 'M', size_l: 'L',
      size_xl: 'XL', size_xxl: 'XXL',
      size_50: '50', size_52: '52', size_54: '54', size_56: '56',
      size_58: '58', size_60: '60', size_62: '62',
      size_custom: 'Custom',
    };
    for (const [key, label] of Object.entries(sizeMap)) {
      if (this.single_product[key]) sizes.push(label);
    }
    return sizes;
  }

  // Preview helper: delivery time text
  get previewDeliveryTime(): string {
    const dt = this.single_product.delivery_time;
    const cdt = this.single_product.custom_delivery_time;
    if (dt === 'custom' && cdt) return `${cdt} days`;
    if (dt) return `${dt} days`;
    return '';
  }

  // ── Delete ─────────────────────────────────────────────────────
  startDelete(id: number, name: string): void {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirm delete',
        data: {
          content: `Your product "${name}" will be deleted permanently.`,
          yes: 'Delete',
          no: 'Cancel',
        },
      })
      .subscribe((confirmed) => {
        if (confirmed) this.deleteProduct(id, name);
      });
  }

  private deleteProduct(id: number, name: string): void {
    this.ui.deleting = true;
    this.delete_payload.product = id;
    this.delete_payload.name = name;

    this.crudService.post_request(this.delete_payload, GlobalComponent.deleteProductById).subscribe({
      next: (response: any) => {
        if (response.response_code === 200 && response.status === 'success') {
          this.toast.success('Product deleted successfully');
          this.fetchProducts();
        } else {
          this.toast.error('Unable to delete product');
        }
        this.ui.deleting = false;
      },
      error: () => {
        this.toast.error('Unable to delete product');
        this.ui.deleting = false;
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  NAVIGATION
  // ═══════════════════════════════════════════════════════════════
  goBack(): void {
    if (this.user_session.is_vendor) {
      this.router.navigate(['/account']);
    }
    if (this.user_session.is_admin) {
      this.router.navigate(['/backend']);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  UTILITIES
  // ═══════════════════════════════════════════════════════════════
  protected readonly formatCurrency = formatCurrency;

  trackById = (_: number, item: ProductListItem) => item.id;

  getStockBadgeClass(status: string): string {
    switch (status) {
      case 'in_stock': return 'badge-stock-in';
      case 'out_of_stock': return 'badge-stock-out';
      case 'on_backorder': return 'badge-stock-backorder';
      default: return '';
    }
  }

  getStockLabel(status: string): string {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'out_of_stock': return 'Out of Stock';
      case 'on_backorder': return 'On Backorder';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    return status === 'published' ? 'badge-status-published' : 'badge-status-draft';
  }

  needsBorder(hex: string): boolean {
    const n = hex.replace('#', '');
    const bigint = parseInt(n.length === 3 ? n.split('').map(c => c + c).join('') : n, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 220;
  }
}
