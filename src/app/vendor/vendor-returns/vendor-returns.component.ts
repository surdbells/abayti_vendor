import {Component, inject, OnInit, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TopComponent} from '../../partials/top/top.component';
import {SideComponent} from '../../partials/side/side.component';
import {TuiButton, TuiIcon, TuiLoader, TuiPopup, TuiTitle} from '@taiga-ui/core';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {CartItems} from '../../class/cart_items';
import {Orders} from '../../class/orders';
import {Config} from 'datatables.net';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
import {GlobalComponent} from '../../global-component';
import {TUI_CONFIRM, TuiDrawer} from '@taiga-ui/kit';
import {DataTablesModule} from 'angular-datatables';
import {NgForOf, NgIf} from '@angular/common';
import {TuiHeader} from '@taiga-ui/layout';

@Component({
  selector: 'app-vendor-returns',
  imports: [
    TopComponent,
    SideComponent,
    TuiIcon,
    DataTablesModule,
    NgForOf,
    NgIf,
    TuiLoader,
    RouterLink,
    TuiButton,
    TuiDrawer,
    TuiHeader,
    TuiPopup,
    TuiTitle
  ],
  standalone: true,
  templateUrl: './vendor-returns.component.html',
  styleUrl: './vendor-returns.component.css'
})
export class VendorReturnsComponent implements OnInit {
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
    this.user_session = JSON.parse(atob(this.session_data));
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
    this.crudService.post_request(this.order, GlobalComponent.getVendorOrders)
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
          this.error_notification(typeof e === 'string' ? e : 'Request failed');
          this.ui_controls.is_loading = false;
          this.ui_controls.no_orders = true;
        },
        complete: () => {
          // optional
        }
      }));
  }
  get_order_items(cart: number) {
    this.ui_controls.loading_items = true;
    this.order_items.cart = cart;
    this.crudService.post_request(this.order_items, GlobalComponent.getOrderItems)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.cartItems =  response.data;
            this.ui_controls.loading_items = false;
            this.open.set(true)
          }
        }
      }))
  }

  startStatusChange(order: number, status: string, email: string) {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirm status',
        data: {
          content: 'Your product order status will be changed and customer will be notified',
          yes: 'Delete',
          no: 'Cancel',
        },
      })
      .subscribe((response) => {
        if (response){
          this.updateOrderStatus(order, status, email);
        }
      });
  }
  updateOrderStatus(order: number, status: string, email: string){
    this.ui_controls.updating_order = true;
    this.update_order.order = order;
    this.update_order.status = status;
    this.update_order.email = email;
    this.crudService.post_request(this.update_order, GlobalComponent.updateOrderStatus)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.updating_order = false;
            this.success_notification(response.message);
            this.get_vendor_orders();
          }
        }
      }))
  }
}
