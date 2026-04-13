import { Component, inject, OnInit } from '@angular/core';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SideComponent } from '../../partials/side/side.component';
import { AsideComponent } from '../../partials/aside/aside.component';
import { TopComponent } from '../../partials/top/top.component';
import { TuiIcon, TuiLoader } from '@taiga-ui/core';
import { Category } from '../../class/category';
import { Labels } from '../../class/labels';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../services/crud.service';
import { HotToastService } from '@ngneat/hot-toast';
import { GlobalComponent } from '../../global-component';
import { TUI_CONFIRM } from '@taiga-ui/kit';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import imageCompression from 'browser-image-compression';

// ── Shared types ─────────────────────────────────────────────────
interface ColorOption {
  id: string;
  text: string;
  hex: string;
}

type EncodedFile = {
  file: File;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  base64: string;
};

// ── Color palette ────────────────────────────────────────────────
const COLOR_OPTIONS: ColorOption[] = [
  { id: 'black', text: 'Black', hex: '#000000' },
  { id: 'white', text: 'White', hex: '#FFFFFF' },
  { id: 'off-white', text: 'Off White', hex: '#FAF9F6' },
  { id: 'charcoal', text: 'Charcoal', hex: '#333333' },
  { id: 'gray', text: 'Gray', hex: '#808080' },
  { id: 'light-gray', text: 'Light Gray', hex: '#D3D3D3' },
  { id: 'beige', text: 'Beige', hex: '#F5F5DC' },
  { id: 'tan', text: 'Tan', hex: '#D2B48C' },
  { id: 'camel', text: 'Camel', hex: '#C19A6B' },
  { id: 'brown', text: 'Brown', hex: '#8B4513' },
  { id: 'chocolate', text: 'Chocolate', hex: '#5D3A00' },
  { id: 'navy', text: 'Navy', hex: '#001F3F' },
  { id: 'blue', text: 'Blue', hex: '#1F75FE' },
  { id: 'light-blue', text: 'Light Blue', hex: '#87CEEB' },
  { id: 'sky-blue', text: 'Sky Blue', hex: '#00BFFF' },
  { id: 'denim', text: 'Denim', hex: '#274472' },
  { id: 'teal', text: 'Teal', hex: '#008080' },
  { id: 'aqua', text: 'Aqua', hex: '#00FFFF' },
  { id: 'mint', text: 'Mint', hex: '#98FF98' },
  { id: 'green', text: 'Green', hex: '#2E8B57' },
  { id: 'lime', text: 'Lime', hex: '#32CD32' },
  { id: 'olive', text: 'Olive', hex: '#808000' },
  { id: 'forest', text: 'Forest Green', hex: '#228B22' },
  { id: 'red', text: 'Red', hex: '#C0392B' },
  { id: 'crimson', text: 'Crimson', hex: '#DC143C' },
  { id: 'burgundy', text: 'Burgundy', hex: '#800020' },
  { id: 'pink', text: 'Pink', hex: '#FFC0CB' },
  { id: 'hot-pink', text: 'Hot Pink', hex: '#FF69B4' },
  { id: 'rose', text: 'Rose', hex: '#FF007F' },
  { id: 'purple', text: 'Purple', hex: '#800080' },
  { id: 'lavender', text: 'Lavender', hex: '#E6E6FA' },
  { id: 'violet', text: 'Violet', hex: '#8A2BE2' },
  { id: 'orange', text: 'Orange', hex: '#FF8C00' },
  { id: 'peach', text: 'Peach', hex: '#FFDAB9' },
  { id: 'coral', text: 'Coral', hex: '#FF7F50' },
  { id: 'yellow', text: 'Yellow', hex: '#FFD200' },
  { id: 'mustard', text: 'Mustard', hex: '#FFDB58' },
  { id: 'gold', text: 'Gold (Metallic)', hex: '#D4AF37' },
  { id: 'silver', text: 'Silver (Metallic)', hex: '#C0C0C0' },
  { id: 'bronze', text: 'Bronze', hex: '#CD7F32' },
  { id: 'champagne', text: 'Champagne', hex: '#F7E7CE' },
  { id: 'ivory', text: 'Ivory', hex: '#FFFFF0' },
  { id: 'multicolor', text: 'Multicolor', hex: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)' },
];

const SIZED_CATEGORIES = [1, 2, 3, 6, 7];

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    AngularEditorModule, FormsModule, ReactiveFormsModule,
    CommonModule,
    SideComponent, AsideComponent, TopComponent,
    TuiIcon, TuiLoader,
    NgMultiSelectDropDownModule,
    NgxDropzoneModule,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit {

  // ── Lookup data ────────────────────────────────────────────────
  category?: Category[];
  labels?: Labels[];
  colorOptions: ColorOption[] = COLOR_OPTIONS;
  dropdownList: { id: number; collection: string }[] = [];
  selectedItems: { id: number; collection: string }[] = [];
  dropdownSettings: any = {};

  // ── Image handling ─────────────────────────────────────────────
  image_url = 'https://api.3bayti.ae/vendors/products/';
  base64String: any;

  /**
   * Existing server images (URL paths like "products_images/abc.jpg").
   * Populated from the API response on load. Users can remove these.
   */
  existingImages: string[] = [];

  /**
   * Newly added files via dropzone. These get compressed and converted to base64.
   */
  newFiles: File[] = [];
  newEncoded: EncodedFile[] = [];

  /** Max gallery images allowed (existing + new combined) */
  readonly MAX_GALLERY_IMAGES = 5;

  // ── Color selection ────────────────────────────────────────────
  selected = new Set<string>();

  // ── Session ────────────────────────────────────────────────────
  private readonly dialogs = inject(TuiResponsiveDialogService);
  session_data: any = '';
  user_session = {
    id: 0, token: '', first_name: '', last_name: '',
    email: '', phone: '',
    is_2fa: false, is_active: false, is_admin: false,
    is_vendor: false, is_customer: false,
  };

  // ── UI controls ────────────────────────────────────────────────
  ui = {
    loading: false,
    creating_label: false,
    page_loading: true,
  };

  // ── Form model ─────────────────────────────────────────────────
  update: any = {
    id: 0, token: '', product: 0, store: 0,
    category: 0, name: '', description: '',
    image_1: 'assets/img/placeholder-1.png',
    images: [] as string[],
    collection: {},
    quantity: 0,
    allow_checkout_when_out_of_stock: false,
    with_storehouse_management: false,
    stock_status: 'in_stock',
    price: 0, cost_per_item: 0,
    minimum_order_quantity: 1, maximum_order_quantity: 1,
    delivery_time: '', custom_delivery_time: '',
    delivery_note: '',
    size_xs: false, size_s: false, size_m: false,
    size_l: false, size_xl: false, size_xxl: false,
    size_50: false, size_51: false, size_52: false, size_53: false,
    size_54: false, size_55: false, size_56: false, size_57: false,
    size_58: false, size_59: false, size_60: false, size_61: false,
    size_62: false, size_63: false, size_64: false,
    size_custom: false,
    require_extra_msmt: false, extra_msmt: '',
    is_featured: false,
    is_hot: false, is_new: false, is_sale: false,
    colors: '', label: 0,
  };

  // ── Label models ───────────────────────────────────────────────
  vendor_labels = { id: 0, token: '' };
  vendor_label_create = { id: 0, token: '', label: '' };

  // ── Product fetch model ────────────────────────────────────────
  private single_product = { id: 0, product: 0, token: '' };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}

  // ═══════════════════════════════════════════════════════════════
  //  LIFECYCLE
  // ═══════════════════════════════════════════════════════════════
  ngOnInit(): void {
    this.session_data = sessionStorage.getItem('SESSION');
    this.user_session = GlobalComponent.decodeBase64(this.session_data);

    const productId = Number(this.route.snapshot.queryParamMap.get('id'));

    this.update.id = this.user_session.id;
    this.update.token = this.user_session.token;
    this.update.product = productId;

    this.single_product.id = this.user_session.id;
    this.single_product.token = this.user_session.token;
    this.single_product.product = productId;

    this.vendor_labels.id = this.user_session.id;
    this.vendor_labels.token = this.user_session.token;
    this.vendor_label_create.id = this.user_session.id;
    this.vendor_label_create.token = this.user_session.token;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'collection',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.fetchProductById();
    this.fetchCategory();
    this.fetchCollections();
    this.fetchVendorLabels();
  }

  // ═══════════════════════════════════════════════════════════════
  //  DATA LOADING
  // ═══════════════════════════════════════════════════════════════
  fetchProductById(): void {
    this.crudService.post_request(this.single_product, GlobalComponent.getProductById).subscribe({
      next: (response: any) => {
        if (response.response_code === 200 && response.status === 'success') {
          this.update = response.data;
          this.selectedItems = response.data.collection ?? [];

          // Populate existing gallery images (filter out placeholders)
          const imgs = response.data.images ?? [];
          this.existingImages = (Array.isArray(imgs) ? imgs : [])
            .filter((src: string) => src && !src.includes('placeholder'));

          // Restore color selections from CSV
          const colorsStr = this.update.colors || '';
          for (const item of colorsStr.split(',').map((s: string) => s.trim()).filter(Boolean)) {
            this.selected.add(item);
          }
          this.ui.page_loading = false;
        }
      },
    });
  }

  fetchCategory(): void {
    this.crudService.get_request(GlobalComponent.UtilityCategory).subscribe({
      next: (response: any) => {
        if (response.response_code === 200 && response.status === 'success') {
          this.category = response.data;
        }
      },
    });
  }

  fetchCollections(): void {
    this.crudService.get_request(GlobalComponent.UtilityCollections).subscribe({
      next: (response: any) => {
        if (response.response_code === 200 && response.status === 'success') {
          this.dropdownList = response.data;
        }
      },
    });
  }

  fetchVendorLabels(): void {
    this.crudService.post_request(this.vendor_labels, GlobalComponent.readLabel).subscribe({
      next: (response: any) => {
        if (response.response_code === 200 && response.status === 'success') {
          this.labels = response.data;
        }
      },
    });
  }

  createVendorLabel(): void {
    if (!this.vendor_label_create.label.length) {
      this.toast.error('Label name is required');
      return;
    }
    this.ui.creating_label = true;
    this.crudService.post_request(this.vendor_label_create, GlobalComponent.createLabel).subscribe({
      next: (response: any) => {
        this.ui.creating_label = false;
        if (response.response_code === 200 && response.status === 'success') {
          this.vendor_label_create.label = '';
          this.toast.success(response.message);
          this.fetchVendorLabels();
        } else {
          this.toast.error(response.message);
        }
      },
      error: () => {
        this.ui.creating_label = false;
        this.toast.error('Unable to complete your request at this time.');
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  COLOR SELECTION
  // ═══════════════════════════════════════════════════════════════
  trackById = (_: number, item: ColorOption) => item.id;

  toggle(id: string, checked: boolean): void {
    checked ? this.selected.add(id) : this.selected.delete(id);
  }

  isSelected(id: string): boolean {
    return this.selected.has(id);
  }

  get selectedColors(): ColorOption[] {
    return this.colorOptions.filter(c => this.selected.has(c.id));
  }

  needsBorder(hex: string): boolean {
    if (hex.startsWith('linear')) return false;
    const n = hex.replace('#', '');
    const bigint = parseInt(n.length === 3 ? n.split('').map(c => c + c).join('') : n, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 220;
  }

  getSelectedIdsCsv(): string {
    return [...this.selected].join(',');
  }

  // ═══════════════════════════════════════════════════════════════
  //  SIZING HELPER
  // ═══════════════════════════════════════════════════════════════
  get showSizing(): boolean {
    return SIZED_CATEGORIES.includes(Number(this.update.category));
  }

  // ═══════════════════════════════════════════════════════════════
  //  IMAGE HANDLING — Featured image
  // ═══════════════════════════════════════════════════════════════
  getImageUrl(src: string): string {
    if (!src) return 'assets/img/placeholder-1.png';
    return src.length > 100 ? src : this.image_url + src;
  }

  async selectFeaturedImage(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (!file) return;
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 3,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        this.update.image_1 = reader.result as string;
      };
      reader.readAsDataURL(compressed);
    } catch (error) {
      this.toast.error('Image compression failed: ' + error);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  IMAGE HANDLING — Gallery (existing + dropzone)
  // ═══════════════════════════════════════════════════════════════

  /** Total gallery images currently (existing server images + newly added) */
  get totalGalleryImages(): number {
    return this.existingImages.length + this.newFiles.length;
  }

  /** How many more images can be added */
  get remainingSlots(): number {
    return Math.max(0, this.MAX_GALLERY_IMAGES - this.totalGalleryImages);
  }

  /** Remove an existing server image by index */
  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
    this.syncImagesToUpdate();
  }

  /** Dropzone: add new files */
  trackByName = (_: number, f: File) => f.name;

  async onGallerySelect(event: NgxDropzoneChangeEvent): Promise<void> {
    const added = event.addedFiles ?? [];

    if (this.totalGalleryImages + added.length > this.MAX_GALLERY_IMAGES) {
      this.toast.error(`You can only have up to ${this.MAX_GALLERY_IMAGES} gallery images. You have ${this.remainingSlots} slot${this.remainingSlots !== 1 ? 's' : ''} remaining.`);
      return;
    }

    this.newFiles.push(...added);

    const results = await Promise.all(
      added.map(async (f) => {
        const compressed = await imageCompression(f, {
          maxSizeMB: 3,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        const dataUrl = await this.fileToDataURL(compressed);
        return {
          file: compressed,
          name: compressed.name,
          type: compressed.type,
          size: compressed.size,
          dataUrl,
          base64: dataUrl.split(',')[1] ?? '',
        } as EncodedFile;
      }),
    );

    this.newEncoded.push(...results);
    this.syncImagesToUpdate();
  }

  /** Dropzone: remove a newly added file */
  onGalleryRemove(file: File): void {
    this.newFiles = this.newFiles.filter(f => f !== file);
    this.newEncoded = this.newEncoded.filter(e => e.file !== file);
    this.syncImagesToUpdate();
  }

  /**
   * Sync the combined images (existing paths + new base64 dataUrls) into
   * update.images so it's ready for submission to the backend.
   */
  private syncImagesToUpdate(): void {
    const newDataUrls = this.newEncoded.map(e => e.dataUrl).filter(Boolean);
    this.update.images = [...this.existingImages, ...newDataUrls];
  }

  private fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  UPDATE FLOW
  // ═══════════════════════════════════════════════════════════════
  startUpdate(): void {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirm update',
        data: {
          content: 'Save your changes. Your product update will go live immediately.',
          yes: 'Save', no: 'Cancel',
        },
      })
      .subscribe((ok) => { if (ok) this.submitUpdate(); });
  }

  private submitUpdate(): void {
    this.update.colors = this.getSelectedIdsCsv();
    this.update.collection = this.selectedItems;
    this.ui.loading = true;

    this.crudService.post_request(this.update, GlobalComponent.updateProduct).subscribe({
      next: (response: any) => {
        this.ui.loading = false;
        if (response.response_code === 200 && response.status === 'success') {
          this.toast.success(response.message);
          this.router.navigate(['/products']);
        } else {
          this.toast.error(response.message);
        }
      },
      error: () => {
        this.ui.loading = false;
        this.toast.error('Unable to complete your request at this time.');
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  EDITOR CONFIG
  // ═══════════════════════════════════════════════════════════════
  editorConfig: AngularEditorConfig = {
    editable: true, spellcheck: true,
    height: '250px', minHeight: '250px', maxHeight: 'auto',
    width: 'auto', minWidth: '0', translate: 'yes',
    enableToolbar: true, showToolbar: true,
    placeholder: 'Detailed description: fabric type, care instructions, style details, delivery time, etc.',
    defaultParagraphSeparator: '', defaultFontName: '', defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
    ],
    sanitize: true, toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize'], ['insertImage', 'insertVideo']],
  };

  // ═══════════════════════════════════════════════════════════════
  //  MULTI-SELECT
  // ═══════════════════════════════════════════════════════════════
  onItemSelect(_item: any): void {}
  onSelectAll(_items: any): void {}

  // ═══════════════════════════════════════════════════════════════
  //  NAVIGATION
  // ═══════════════════════════════════════════════════════════════
  goBack(): void {
    this.router.navigate(['/products']);
  }
}
