import {Component, OnInit} from '@angular/core';
import {Config} from 'datatables.net';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudService} from '../../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../../global-component';
import {AdminTopComponent} from '../../../partials/admin-top/admin-top.component';
import {DataTablesModule} from 'angular-datatables';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiIcon, TuiLoader} from '@taiga-ui/core';
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
  selector: 'app-store-sales',
  standalone: true,
  imports: [
    AdminTopComponent,
    DataTablesModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TuiIcon,
    TuiLoader,
    FormsModule
  ],
  templateUrl: './store-sales.component.html',
  styleUrl: './store-sales.component.css'
})
export class StoreSalesComponent implements OnInit{
  sales?: Sales[];
  dtOptions: Config = {};
  ui_controls = {
    is_loading: false,
    no_data: false
  };
  session_data: any = ""
  store_name: any = ""
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
    private route: ActivatedRoute,
    private toast: HotToastService,
  ) {}
  get_store_s = {
    id: 0,
    token: "",
    store: 0
  }
  get_store_range = {
    id: 0,
    token: "",
    start_date: "",
    end_date: "",
    storeId: 0

  }
  ngOnInit() {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    const storeId =  Number(this.route.snapshot.queryParamMap.get('id'));
    this.store_name =  this.route.snapshot.queryParamMap.get('name');

    this.get_store_s.token = this.user_session.token;
    this.get_store_s.id = this.user_session.id;
    this.get_store_s.store = storeId;

    this.get_store_range.token = this.user_session.token;
    this.get_store_range.id = this.user_session.id;
    this.get_store_range.storeId = storeId;
    this.get_sales()
  }
  product = {
    token: '',
    id: 0,
    store: 0
  };
  goBack() {
    this.router.navigate(['/backend']).then(r => console.log(r));
  }

  get_sales() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_store_s, GlobalComponent.sales)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.sales = response.data;
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
    this.crudService.post_request(this.get_store_range, GlobalComponent.sales)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.sales = response.data;
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
