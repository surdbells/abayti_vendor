import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../global-component';
import {AsideComponent} from '../../partials/aside/aside.component';
import {DataTablesModule} from 'angular-datatables';
import {NgForOf, NgIf} from '@angular/common';
import {TopComponent} from '../../partials/top/top.component';
import {TuiAppearance, TuiIcon, TuiLoader, TuiSurface, TuiTitle} from '@taiga-ui/core';
import {Config} from 'datatables.net';
import {AdminTopComponent} from '../../partials/admin-top/admin-top.component';
import {FormsModule} from '@angular/forms';
import {TuiCardLarge, TuiCell, TuiHeader} from '@taiga-ui/layout';
import {TuiAvatar} from '@taiga-ui/kit';
export interface Sales {
  id: number;
  order_ref: string;
  product_name: string;
  transaction_ref: string;
  quantity: number;
  price: number;
  total_price: string;
  delivery: string;
  total_paid: string;
  noon: string;
  commission: string;
  charges: string;
  vendor_pay: string;
  customer_email: string;
  customer_name: string;
  status: string;
  created: string;
}
@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    AsideComponent,
    DataTablesModule,
    NgForOf,
    NgIf,
    TopComponent,
    TuiIcon,
    TuiLoader,
    AdminTopComponent,
    FormsModule,
    TuiCardLarge,
    TuiHeader,
    TuiSurface,
    TuiTitle,
    TuiAppearance,
    TuiCell,
    TuiAvatar
  ],
  templateUrl: './commissions.component.html',
  styleUrl: './commissions.component.css'
})
export class CommissionsComponent implements OnInit{
  sales?: Sales[];
  dtOptions: Config = {};
  ui_controls = {
    is_loading: false,
    no_data: false
  };
  session_data: any = ""
  commissions: any = ""
  charges: any = ""
  stats = {
    commissions: "",
    charges: ""
  };
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

  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}

  ngOnInit() {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    this.get_s.id = this.user_session.id;
    this.get_s.token = this.user_session.token;

    this.get_store_s.id = this.user_session.id;
    this.get_store_s.token = this.user_session.token

    this.get_sale_range.id = this.user_session.id;
    this.get_sale_range.token = this.user_session.token
    this.get_sales();
  }

  get_s = {
    id: 0,
    token: ""
  }

  get_store_s = {
    id: 0,
    token: ""
  }
  get_sale_range = {
    id: 0,
    token: "",
    start_date: "",
    end_date: ""
  }
  goBack() {
    this.router.navigate(['/backend']).then(r => console.log(r));
  }

  get_sales() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_s, GlobalComponent.commissions)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.sales = response.data;
            this.stats = response.message;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }
        }
      }))
  }
  get_range_sales() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_sale_range, GlobalComponent.commissions)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.sales = response.data;
            this.stats = response.message;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }
        }
      }))
  }
}
