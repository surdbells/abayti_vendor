import {Component, OnInit} from '@angular/core';
import {AdminTopComponent} from "../../../partials/admin-top/admin-top.component";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TuiIcon, TuiLoader} from "@taiga-ui/core";
import {CrudService} from '../../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../../global-component';
import {Products} from '../../../class/products';
import {Config} from 'datatables.net';
import {DataTablesModule} from 'angular-datatables';

@Component({
  selector: 'app-store-products',
  standalone: true,
  imports: [
    AdminTopComponent,
    NgIf,
    RouterLink,
    TuiIcon,
    TuiLoader,
    DataTablesModule,
    NgForOf
  ],
  templateUrl: './store-products.component.html',
  styleUrl: './store-products.component.css'
})
export class StoreProductsComponent implements OnInit{
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
    const storeId =  Number(this.route.snapshot.queryParamMap.get('id'));
    this.store_name =  this.route.snapshot.queryParamMap.get('name');

    this.product.token = this.user_session.token;
    this.product.id = this.user_session.id;
    this.product.store = storeId;
    this.get_vendor_product()
  }
  product = {
    token: '',
    id: 0,
    store: 0
  };
  goBack() {
    this.router.navigate(['/stores']).then(r => console.log(r));
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

  openProduct(id: number, name: string) {
    this.router.navigate(
      ['/', 'adminviewproduct'],
      { queryParams: {id} }
    ).then(r => console.log(r));
  }
}
