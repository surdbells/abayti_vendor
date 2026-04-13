import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudService} from '../../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../../global-component';
import {AsideComponent} from '../../../partials/aside/aside.component';
import {DataTablesModule} from 'angular-datatables';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TopComponent} from '../../../partials/top/top.component';
import {TuiIcon, TuiLoader} from '@taiga-ui/core';
import {Config} from 'datatables.net';
import {AdminTopComponent} from '../../../partials/admin-top/admin-top.component';
import {FormsModule} from '@angular/forms';
export interface Items {
  product_name: string;
  billing_city: number;
  billing_area: string;
  billing_email: string;
  customer: string;
  quantity: number;
  villa_number: string;
  status: string;
  billing_name: string;
  billing_street: string;
  billing_phone: string;
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
    NgClass
  ],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.css'
})
export class DeliveriesComponent implements OnInit{
  items?: Items[];
  dtOptions: Config = {};
  ui_controls = {
    is_loading: false,
    no_data: false
  };
  session_data: any = ""
  single_vendor: any = ""
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
  vendor = {
    id: 65,
    phone: '+',
    email: '',
    name: '',
    store_name: '',
    store_email: '',
    store_phone: '',
    store_address: '',
    store_bank_name: '',
    store_account_name: '',
    store_account_number: '',
    last_login: '',
    trade_license_number: '',
    licensing_authority: ''
  };

  constructor(
    private router: Router,
    private crudService: CrudService,
    private route: ActivatedRoute,
    private toast: HotToastService,
  ) {}

  ngOnInit() {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);

    this.getProcessingById.id = this.user_session.id;
    this.getProcessingById.token = this.user_session.token

    this.getProductsByVendor.id = this.user_session.id;
    this.getProductsByVendor.token = this.user_session.token
    this.single_vendor = this.route.snapshot.queryParamMap.get('vendor');
    this.get_processingById();
  }
  getProcessingById = {
    id: 0,
    token: "",
    vendor: "",
  }
  getProductsByVendor = {
    id: 0,
    token: "",
    vendor: 0,
  }
  get_processingById() {
    this.getProcessingById.vendor = this.single_vendor;
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.getProcessingById, GlobalComponent.pluralById)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.vendor = response.data;
            this.ui_controls.is_loading = false;
            this.get_vendorProducts();
          }
        }
      }))
  }
  get_vendorProducts() {
    this.getProductsByVendor.vendor = this.vendor.id;
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.getProductsByVendor, GlobalComponent.productsByVendorId)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.items = response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10,
              order: [0, "desc"]
            };
          }
        }
      }))
  }
}
