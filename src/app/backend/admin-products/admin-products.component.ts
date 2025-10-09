import {Component, OnInit} from '@angular/core';
import {AdminTopComponent} from "../../partials/admin-top/admin-top.component";
import {DataTablesModule} from "angular-datatables";
import {NgForOf, NgIf} from "@angular/common";
import {TuiIcon, TuiLoader} from "@taiga-ui/core";
import {Products} from '../../class/products';
import {Config} from 'datatables.net';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../global-component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    AdminTopComponent,
    DataTablesModule,
    NgForOf,
    NgIf,
    TuiIcon,
    TuiLoader,
    FormsModule
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit{
  products?: Products[];
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

  ngOnInit() {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    this.product.token = this.user_session.token;
    this.product.id = this.user_session.id;

    this.product_S.token = this.user_session.token;
    this.product_S.id = this.user_session.id;
    this.get_product()
  }
  product = {
    token: '',
    id: 0,
  };
  product_S = {
    token: '',
    id: 0,
    status: "",
  };
  goBack() {
    this.router.navigate(['/backend']).then(r => console.log(r));
  }
  error_notification(message: string) {
    this.toast.error(message);
  }
  success_notification(message: string) {
    this.toast.success(message);
  }

  get_product() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.product, GlobalComponent.getAdminProducts)
      .subscribe(({
        next: (response: any) => {
          if (response.response_code === 200 && response.status === 'success') {
            this.products = response.data ?? [];
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }
          this.ui_controls.is_loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error_notification("Unable to complete your request at this time.");
          this.ui_controls.is_loading = false;
        },
        complete: () => {
          // optional
        }
      }));
  }
  get_product_status(event: Event) {
    this.product_S.status = (event.target as HTMLSelectElement).value;
    this.ui_controls.is_loading = true;
    this.products = [];
    this.crudService.post_request(this.product_S, GlobalComponent.getAdminProducts)
      .subscribe(({
        next: (response: any) => {
          if (response.response_code === 200 && response.status === 'success') {
            this.products = response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }
          this.ui_controls.is_loading = false;
        },
        error: (e: any) => {
          console.error(e);
          this.error_notification("Unable to complete your request at this time.");
          this.ui_controls.is_loading = false;
        },
        complete: () => {
          // optional
        }
      }));
  }
}
