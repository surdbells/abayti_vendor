import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../global-component';
import {AsideComponent} from '../../partials/aside/aside.component';
import {DataTablesModule} from 'angular-datatables';
import {NgForOf, NgIf} from '@angular/common';
import {TopComponent} from '../../partials/top/top.component';
import {TuiIcon, TuiLoader} from '@taiga-ui/core';
import {Config} from 'datatables.net';
import {AdminTopComponent} from '../../partials/admin-top/admin-top.component';
import {FormsModule} from '@angular/forms';
export interface Transactions {
  id: number;
  order_id: string;
  transaction_id: string;
  cart_code: string;
  merchantReference: string;
  amount: string;
  customer: string;
  status: string;
  created: string;
  updated: string;
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
    FormsModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit{
  transactions?: Transactions[];
  dtOptions: Config = {};
  ui_controls = {
    is_loading: false,
    no_data: false
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

  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}

  ngOnInit() {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    this.get_trx.id = this.user_session.id;
    this.get_trx.token = this.user_session.token

    this.get_trx_range.id = this.user_session.id;
    this.get_trx_range.token = this.user_session.token
    this.get_trxs();
  }

  get_trx = {
    id: 0,
    token: ""
  }
  get_trx_range = {
    id: 0,
    token: "",
    start_date: "",
    end_date: ""
  }
  goBack() {
    this.router.navigate(['/backend']).then(r => console.log(r));
  }

  get_trxs() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_trx, GlobalComponent.transactions)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.transactions = response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }
        }
      }))
  }
  get_range_trx() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_trx_range, GlobalComponent.transactions)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.transactions = response.data;
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
