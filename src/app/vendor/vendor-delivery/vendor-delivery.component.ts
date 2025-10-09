import {Component, inject, OnInit, signal} from '@angular/core';
import {DataTablesModule} from "angular-datatables";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {SideComponent} from "../../partials/side/side.component";
import {TopComponent} from "../../partials/top/top.component";
import {TuiButton, TuiIcon, TuiLoader, TuiPopup, TuiTitle} from "@taiga-ui/core";
import {TuiDrawer} from "@taiga-ui/kit";
import {TuiHeader} from "@taiga-ui/layout";
import {CartItems} from '../../class/cart_items';
import {Orders} from '../../class/orders';
import {Config} from 'datatables.net';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../global-component';

@Component({
  selector: 'app-vendor-delivery',
  standalone: true,
    imports: [
        DataTablesModule,
        NgForOf,
        NgIf,
        RouterLink,
        SideComponent,
        TopComponent,
        TuiButton,
        TuiDrawer,
        TuiHeader,
        TuiIcon,
        TuiLoader,
        TuiPopup,
        TuiTitle
    ],
  templateUrl: './vendor-delivery.component.html',
  styleUrl: './vendor-delivery.component.css'
})
export class VendorDeliveryComponent implements OnInit {
  cartItems?: CartItems[];
  orders?: Orders[];
  dtOptions: Config = {};
  protected readonly open = signal(false);
  private readonly dialogs = inject(TuiResponsiveDialogService);
  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}

  ui_controls = {
    is_loading: false,
    no_orders: false,
    loading_items: false,
    updating_order: false
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
  order = {
    token: '',
    id: 0
  };
  order_items = {
    id: 0,
    cart: 0,
    token: ""
  };
  update_order = {
    id: 0,
    order: 0,
    token: "",
    status: "",
    email: ""
  };

  ngOnInit() {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    this.order.token = this.user_session.token
    this.order.id = this.user_session.id
    this.order_items.token = this.user_session.token
    this.order_items.id = this.user_session.id

    this.update_order.token = this.user_session.token
    this.update_order.id = this.user_session.id
    this.get_vendor_orders();
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
  get_vendor_orders() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.order, GlobalComponent.getVendorDeliveryOrders)
      .subscribe(({
        next: (response: any) => {
          if (response.response_code === 200 && response.status === 'success') {
            this.orders = response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          } else {
            this.ui_controls.no_orders = true;
          }
          this.ui_controls.is_loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error_notification("Unable to complete your request at this time.");
          this.ui_controls.is_loading = false;
          this.ui_controls.no_orders = true;
        },
        complete: () => {
          // optional
        }
      }));
  }
  open_order(id: number, name:string) {
    this.router.navigate(
      ['/', 'receipt'],
      { queryParams: {id, name} }
    ).then(r => console.log(r));
  }
}
