import {Component, inject, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {TopComponent} from '../../partials/top/top.component';
import {SideComponent} from '../../partials/side/side.component';
import {TuiButton, TuiIcon, TuiLoader, TuiPopup, TuiTitle} from '@taiga-ui/core';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {DataTablesModule} from 'angular-datatables';
import {NgForOf, NgIf} from '@angular/common';
import {Config} from 'datatables.net';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
import {GlobalComponent} from '../../global-component';
import {TuiDrawer} from '@taiga-ui/kit';
import {Orders} from '../../class/orders';
import {TuiHeader} from '@taiga-ui/layout';
import {CartItems} from '../../class/cart_items';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-vendor-orders',
  imports: [
    TopComponent,
    SideComponent,
    TuiIcon,
    DataTablesModule,
    NgForOf,
    NgIf,
    TuiLoader,
    TuiButton,
    TuiDrawer,
    TuiHeader,
    TuiPopup,
    TuiTitle,
    FormsModule
  ],
  standalone: true,
  templateUrl: './vendor-orders.component.html',
  styleUrl: './vendor-orders.component.css'
})
export class VendorOrdersComponent implements OnInit {
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
  singleStatus = {
    id: 0,
    token: "",
    status: "Accepted"
  };

  ngOnInit() {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    this.order.token = this.user_session.token
    this.order.id = this.user_session.id
    this.singleStatus.token = this.user_session.token
    this.singleStatus.id = this.user_session.id
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
      ['/', 'order'],
      { queryParams: {id, name} }
    ).then(r => console.log(r));
  }

  get_vendor_orders_status(event: Event) {
    this.singleStatus.status = (event.target as HTMLSelectElement).value;
    this.ui_controls.is_loading = true;
    this.ui_controls.no_orders = false;
    this.orders = [];
    this.crudService.post_request(this.singleStatus, GlobalComponent.getVendorOrdersByStatus)
      .subscribe(({
        next: (response: any) => {
          if (response.response_code === 200 && response.status === 'success') {
            this.orders = response.data;
            this.ui_controls.is_loading = false;
            this.ui_controls.no_orders = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          } else {
            this.ui_controls.no_orders = true;
          }
          this.ui_controls.no_orders = false;
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
}
