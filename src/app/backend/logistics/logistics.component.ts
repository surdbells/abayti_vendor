import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../global-component';
import {AsideComponent} from '../../partials/aside/aside.component';
import {DataTablesModule} from 'angular-datatables';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {TopComponent} from '../../partials/top/top.component';
import {TuiIcon, TuiLoader} from '@taiga-ui/core';
import {Config} from 'datatables.net';
import {AdminTopComponent} from '../../partials/admin-top/admin-top.component';
import {FormsModule} from '@angular/forms';
export interface Logistics {
  id: number;
  order_ref: string;
  product_name: string;
  transaction_ref: string;
  quantity: number;
  delivery: string;
  total_paid: string;
  delivery_email: string;
  delivery_name: string;
  delivery_phone: string;
  delivery_street_address: string;
  delivery_city: string;
  delivery_area: string;
  villa_number: string;
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
    CommonModule,
    TuiLoader,
    AdminTopComponent,
    FormsModule
  ],
  templateUrl: './logistics.component.html',
  styleUrl: './logistics.component.css'
})
export class LogisticsComponent implements OnInit{
  logistic?: Logistics[];
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
    this.get_del.id = this.user_session.id;
    this.get_del.token = this.user_session.token;
    this.get_del_status.id = this.user_session.id;
    this.get_del_status.token = this.user_session.token
    this.get_logistics();
  }

  get_del = {
    id: 0,
    token: ""
  }
  get_del_status = {
    id: 0,
    token: "",
    status: "Ready for Delivery"
  }
  goBack() {
    this.router.navigate(['/backend']).then(r => console.log(r));
  }

  get_logistics() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_del, GlobalComponent.logistics)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.logistic = response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }
        }
      }))
  }
  get_status_logistics(event: Event) {
    this.get_del_status.status = (event.target as HTMLSelectElement).value;
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_del_status, GlobalComponent.logistics)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.logistic = response.data;
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
