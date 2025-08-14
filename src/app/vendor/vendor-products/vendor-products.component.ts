import {Component, inject, OnInit, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { TopComponent } from '../../partials/top/top.component';
import { SideComponent } from '../../partials/side/side.component';
import {TuiButton, TuiIcon, TuiLoader, TuiPopup, TuiTitle} from '@taiga-ui/core';
import { CrudService } from '../../services/crud.service';
import { HotToastService } from '@ngneat/hot-toast';
import { FormsModule } from '@angular/forms';
import {CommonModule, formatCurrency} from '@angular/common';
import {GlobalComponent} from '../../global-component';
import {Products} from '../../class/products';
import {DataTablesModule} from 'angular-datatables';
import {Config} from 'datatables.net';
import {TuiDrawer} from '@taiga-ui/kit';
import {TuiHeader} from '@taiga-ui/layout';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';

@Component({
  selector: 'app-vendor-products',
  standalone: true,
  imports: [
    TopComponent,
    SideComponent,
    TuiIcon,
    CommonModule,
    FormsModule,
    RouterLink,
    TuiLoader,
    DataTablesModule,
    TuiDrawer,
    TuiHeader,
    TuiTitle,
    TuiPopup,
    TuiButton
  ],
  templateUrl: './vendor-products.component.html',
  styleUrl: './vendor-products.component.css'
})
export class VendorProductsComponent implements OnInit {
  products?: Products[];
  dtOptions: Config = {};
  protected readonly open = signal(false);
  private readonly dialogs = inject(TuiResponsiveDialogService);

  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}
  image_url: any = "https://api.3bayti.com/vendors/products/"

  ui_controls = {
    is_loading: false,
    no_products: false,
    loaded_preview: false
  };
  session_data: any = ""
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
  filters = {
    search: '',
    priceRange: '',
    quantity: '',
    status: '',
  };
  single_product = {
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
  product = {
    token: '',
    id: 0,
    store: 0
  };
  get_single_product = {
    id: 0,
    product: 0,
    token: ""
  };

  ngOnInit() {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = JSON.parse(atob(this.session_data));
    this.product.token = this.user_session.token
    this.product.id = this.user_session.id
    this.product.store = this.user_session.id

    this.get_single_product.token = this.user_session.token
    this.get_single_product.id = this.user_session.id
    this.get_vendor_product();
  }

  goBack() {
    this.router.navigate(['/account']).then(r => console.log(r));
  }
  error_notification(message: string) {
    this.toast.error(message);
  }
  success_notification(message: string) {
    this.toast.success(message);
  }
  get_vendor_product() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.product, GlobalComponent.getProduct)
      .subscribe(({
        next: (response: any) => {
          if (response.response_code === 200 && response.status === 'success') {
            this.products = response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          } else {
            this.error_notification(response.message);
            this.ui_controls.no_products = true;
          }
          this.ui_controls.is_loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error_notification(typeof e === 'string' ? e : 'Request failed');
          this.ui_controls.is_loading = false;
        },
        complete: () => {
          // optional
        }
      }));
  }

  editProduct(id: number, name: string) {
    localStorage.setItem("PRODUCT_ID", String(id));
    localStorage.setItem("PRODUCT_NAME", name);
    this.router.navigate(['/edit-product']).then(r => console.log(r));

  }
  get_product_by_id(id: number) {
    this.ui_controls.loaded_preview = false;
    this.get_single_product.product = id;
    this.crudService.post_request(this.get_single_product, GlobalComponent.getProductById)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.single_product =  response.data;
            this.ui_controls.loaded_preview = true;
            this.open.set(true)
          }
        }
      }))
  }

  preview(id: number) {
    this.get_product_by_id(id);
  }

  protected readonly formatCurrency = formatCurrency;
}
