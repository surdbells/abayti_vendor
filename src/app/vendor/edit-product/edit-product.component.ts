import {Component, inject, OnInit} from '@angular/core';
import {AngularEditorConfig, AngularEditorModule} from "@kolkov/angular-editor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {SideComponent} from "../../partials/side/side.component";
import {TopComponent} from "../../partials/top/top.component";
import {TuiIcon, TuiLoader} from "@taiga-ui/core";
import {Category} from '../../class/category';
import {Labels} from '../../class/labels';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
import {Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../global-component';
import {TUI_CONFIRM} from '@taiga-ui/kit';

interface ColorOption {
  id: string;
  text: string;
  hex: string;
}
@Component({
  selector: 'app-edit-product',
  standalone: true,
    imports: [
        AngularEditorModule,
        FormsModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        SideComponent,
        TopComponent,
        TuiIcon,
        TuiLoader
    ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit{
  category?: Category[];
  labels?: Labels[];
  private readonly dialogs = inject(TuiResponsiveDialogService);
  colorOptions: ColorOption[] = [
    { id: 'black', text: 'Black', hex: '#000000' },
    { id: 'white', text: 'White', hex: '#FFFFFF' },
    { id: 'off-white', text: 'Off White', hex: '#FAF9F6' },
    { id: 'charcoal', text: 'Charcoal', hex: '#333333' },
    { id: 'gray', text: 'Gray', hex: '#808080' },
    { id: 'beige', text: 'Beige', hex: '#F5F5DC' },
    { id: 'tan', text: 'Tan', hex: '#D2B48C' },
    { id: 'brown', text: 'Brown', hex: '#8B4513' },
    { id: 'navy', text: 'Navy', hex: '#001F3F' },
    { id: 'blue', text: 'Blue', hex: '#1F75FE' },
    { id: 'light-blue', text: 'Light Blue', hex: '#87CEEB' },
    { id: 'denim', text: 'Denim', hex: '#274472' },
    { id: 'teal', text: 'Teal', hex: '#008080' },
    { id: 'green', text: 'Green', hex: '#2E8B57' },
    { id: 'olive', text: 'Olive', hex: '#808000' },
    { id: 'red', text: 'Red', hex: '#C0392B' },
    { id: 'burgundy', text: 'Burgundy', hex: '#800020' },
    { id: 'pink', text: 'Pink', hex: '#FFC0CB' },
    { id: 'purple', text: 'Purple', hex: '#800080' },
    { id: 'orange', text: 'Orange', hex: '#FF8C00' },
    { id: 'yellow', text: 'Yellow', hex: '#FFD200' },
    { id: 'mustard', text: 'Mustard', hex: '#FFDB58' },
    { id: 'gold', text: 'Gold (Metallic)', hex: '#D4AF37' },
    { id: 'silver', text: 'Silver (Metallic)', hex: '#C0C0C0' }
  ];
  base64String : any;
  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}
  ui_controls = {
    is_loading: false,
    is_creating_label: false,
    page_loading: false
  };
  session_data: any = ""
  image_url: any = "https://api.3bayti.com/vendors/products/"
  user_session = {
    id: 0,
    token: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    is_2fa: false,
    is_active: false,
    is_admin: false,
    is_vendor: false,
    is_customer: false
  };
  update = {
    id: 0,
    token: "",
    product: 0,
    store: 0,
    category: 0,
    name: "",
    description: "",
    image_1: "assets/img/placeholder-1.png",
    image_2: "assets/img/placeholder-1.png",
    image_3: "assets/img/placeholder-1.png",
    image_4: "assets/img/placeholder-1.png",
    image_5: "assets/img/placeholder-1.png",
    quantity: 0,
    allow_checkout_when_out_of_stock: false,
    with_storehouse_management: false,
    stock_status: "in_stock",
    sale_price: 0,
    price: 0,
    minimum_order_quantity: 1,
    maximum_order_quantity: 1,
    height: 0,
    weight: 0,
    wide: 0,
    length: 0,
    cost_per_item: 0,
    delivery_time: "",
    custom_delivery_time: "",
    size_xs: false,
    size_s: false,
    size_m: false,
    size_l: false,
    size_xl: false,
    size_xxl: false,
    size_custom: false,
    is_hot: false,
    is_new: false,
    is_sale: false,
    is_new_arrival: false,
    is_winter_collection: false,
    is_eid_collection: false,
    is_best_sellers: false,
    is_special_offer: false,
    delivery_note: "",
    colors: "",
    label: 0
  };
  vendor_labels = {
    id: 0,
    token: ""
  };
  vendor_label_create = {
    id: 0,
    token: "",
    label: ""
  };
  single_product = {
    id: 0,
    product: 0,
    token: ""
  }
  selected = new Set<string>();
  trackById = (_: number, item: ColorOption) => item.id;

  toggle(id: string, checked: boolean) {
    checked ? this.selected.add(id) : this.selected.delete(id);
  }
  isSelected(id: string) {
    return this.selected.has(id);
  }
  // Show chips for selected colors
  get selectedColors(): ColorOption[] {
    return this.colorOptions.filter(c => this.selected.has(c.id));
  }
  // Add a subtle border for very light swatches
  needsBorder(hex: string): boolean {
    const rgb = this.hexToRgb(hex);
    const brightness = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    return brightness > 220; // white-ish tones
  }
  private hexToRgb(hex: string) {
    const n = hex.replace('#', '');
    const bigint = parseInt(n.length === 3 ? n.split('').map(c => c + c).join('') : n, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }
  // If you need the ids as an array for submit:
  getSelectedIds(): string[] {
    return Array.from(this.selected);
  }
  getSelectedIdsCsv(delimiter = ','): string {
    return [...this.selected].map(String).join(delimiter);
  }
  ngOnInit(): void {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = JSON.parse(atob(this.session_data));
    this.update.id = this.user_session.id;
    this.update.token = this.user_session.token;

    this.update.name = localStorage.getItem("PRODUCT_NAME") ?? "";
    const productId = localStorage.getItem("PRODUCT_ID");
    this.update.product = productId !== null ? Number(productId) : 0;

    this.single_product.id = this.user_session.id;
    this.single_product.token = this.user_session.token;
    this.single_product.product = this.update.product;

    this.vendor_labels.id = this.user_session.id;
    this.vendor_labels.token = this.user_session.token;
    this.vendor_label_create.id = this.user_session.id;
    this.vendor_label_create.token = this.user_session.token;

    this.get_category();
    this.colorOptions = [
      { id: 'black', text: 'Black', hex: '#000000' },
      { id: 'white', text: 'White', hex: '#FFFFFF' },
      { id: 'off-white', text: 'Off White', hex: '#FAF9F6' },
      { id: 'charcoal', text: 'Charcoal', hex: '#333333' },
      { id: 'gray', text: 'Gray', hex: '#808080' },
      { id: 'beige', text: 'Beige', hex: '#F5F5DC' },
      { id: 'tan', text: 'Tan', hex: '#D2B48C' },
      { id: 'brown', text: 'Brown', hex: '#8B4513' },
      { id: 'navy', text: 'Navy', hex: '#001F3F' },
      { id: 'blue', text: 'Blue', hex: '#1F75FE' },
      { id: 'light-blue', text: 'Light Blue', hex: '#87CEEB' },
      { id: 'denim', text: 'Denim', hex: '#274472' },
      { id: 'teal', text: 'Teal', hex: '#008080' },
      { id: 'green', text: 'Green', hex: '#2E8B57' },
      { id: 'olive', text: 'Olive', hex: '#808000' },
      { id: 'red', text: 'Red', hex: '#C0392B' },
      { id: 'burgundy', text: 'Burgundy', hex: '#800020' },
      { id: 'pink', text: 'Pink', hex: '#FFC0CB' },
      { id: 'purple', text: 'Purple', hex: '#800080' },
      { id: 'orange', text: 'Orange', hex: '#FF8C00' },
      { id: 'yellow', text: 'Yellow', hex: '#FFD200' },
      { id: 'mustard', text: 'Mustard', hex: '#FFDB58' },
      { id: 'gold', text: 'Gold (Metallic)', hex: '#D4AF37' },
      { id: 'silver', text: 'Silver (Metallic)', hex: '#C0C0C0' }
    ];
  }
  goBack() {
    this.router.navigate(['/products']).then(r => console.log(r));
  }
  error_notification(message: string) {
    this.toast.error(message);
  }
  success_notification(message: string) {
    this.toast.success(message);
  }
  updateProduct() {
    this.update.colors = this.getSelectedIdsCsv();
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.update, GlobalComponent.updateProduct)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.success_notification(response.message);
            this.router.navigate(['/products']).then(r => console.log(r));
          }
          if (response.response_code == 200 && response.status === "failed") {
            this.ui_controls.is_loading = false;
            this.error_notification(response.message);
          }
          if (response.response_code == 400 && response.status === "failed") {
            this.ui_controls.is_loading = false;
            this.error_notification(response.message);
          }
        },
        error: (e) => {
          console.error(e);
          this.error_notification(e);
          this.ui_controls.is_loading = false;
        },
        complete: () => {
          console.info('complete');
        }
      }))
  }
  create_vendor_labels() {
    if (this.vendor_label_create.label.length === 0) {
      this.error_notification("Label name is required");
      return;
    }
    this.ui_controls.is_creating_label = true;
    this.crudService.post_request(this.vendor_label_create, GlobalComponent.createLabel)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.vendor_label_create.label = "";
            this.ui_controls.is_creating_label = false;
            this.success_notification(response.message);
            this.get_vendor_labels();
          }
          if (response.response_code == 200 && response.status === "failed") {
            this.ui_controls.is_creating_label = false;
            this.error_notification(response.message);
          }
          if (response.response_code == 400 && response.status === "failed") {
            this.ui_controls.is_creating_label = false;
            this.error_notification(response.message);
          }
        },
        error: (e) => {
          console.error(e);
          this.error_notification(e);
          this.ui_controls.is_loading = false;
        },
        complete: () => {
          console.info('complete');
        }
      }))
  }

  select_image_1(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64String = reader.result as string;
      this.update.image_1 =  this.base64String;
    };
    if(file){ reader.readAsDataURL(file); }
  }
  select_image_2(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64String = reader.result as string;
      this.update.image_2 =  this.base64String;
    };
    if(file){ reader.readAsDataURL(file); }
  }
  select_image_3(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64String = reader.result as string;
      this.update.image_3 =  this.base64String;
    };
    if(file){ reader.readAsDataURL(file); }
  }
  select_image_4(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64String = reader.result as string;
      this.update.image_4 =  this.base64String;
    };
    if(file){ reader.readAsDataURL(file); }
  }
  select_image_5(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64String = reader.result as string;
      this.update.image_5 =  this.base64String;
    };
    if(file){ reader.readAsDataURL(file); }
  }
  get_category() {
    this.ui_controls.page_loading = true;
    this.crudService.get_request(GlobalComponent.UtilityCategory)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.category =  response.data;
            this.get_vendor_labels();
          }
        }
      }))
  }
  get_vendor_labels() {
    this.crudService.post_request(this.vendor_labels, GlobalComponent.readLabel)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.labels =  response.data;
            this.get_product_by_id()
          }
        }
      }))
  }
  get_product_by_id() {
    this.crudService.post_request(this.single_product, GlobalComponent.getProductById)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.update =  response.data;
            for (const item of this.update.colors.split(',').map(s => s.trim()).filter(Boolean)) {
              this.selected.add(item);
            }
            console.log(this.update);
            this.ui_controls.page_loading = false;
          }
        }
      }))
  }
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '250px',
    minHeight: '250px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Detailed description, Include: Fabric type, care instructions, style details, delivery time, etc.',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize'],
      ['insertImage','insertVideo']

    ]
  };
  start_update() {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirm update',
        data: {
          content: 'Save your changes. Your product update will go live immediately.',
          yes: 'Save',
          no: 'Cancel',
        },
      })
      .subscribe((response) => {
        if (response){
          this.updateProduct();
        }
      });
  }
}
