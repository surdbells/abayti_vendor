import {Component, OnInit} from '@angular/core';
import {SideComponent} from "../../partials/side/side.component";
import {TopComponent} from "../../partials/top/top.component";
import {TuiIcon, TuiLoader} from "@taiga-ui/core";
import {Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {GlobalComponent} from '../../global-component';

@Component({
  selector: 'app-vendor-payment',
  standalone: true,
  imports: [
    SideComponent,
    TopComponent,
    TuiIcon,
    FormsModule,
    CommonModule,
    TuiLoader
  ],
  templateUrl: './vendor-payment.component.html',
  styleUrl: './vendor-payment.component.css'
})
export class VendorPaymentComponent implements OnInit {
  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}
  ui_controls = {
    is_loading: false
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
  store_single = {
    store_bank_name: "",
    store_account_name: "",
    store_account_number: ""
  }
  get_single = {
    id: 0,
    token: ""
  }
  update_payment = {
    id: 0,
    token: "",
    store_bank_name: "",
    store_account_name: "",
    store_account_number: ""
  }
  ngOnInit(): void {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    if (!this.user_session.is_active){
      this.router.navigate(['/', '']).then(r => console.log(r)); return;
    }
    this.get_single.id = this.user_session.id;
    this.get_single.token = this.user_session.token;
    this.get_data();
  }
  goBack() {
    this.router.navigate(['/account']).then(r => console.log(r));
  }
  get_data() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_single, GlobalComponent.getVendorPayment)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.store_single = response.data;
          }
          if (response.response_code == 200 && response.status === "failed") {
            this.ui_controls.is_loading = false;
            this.error_notification(response.message);
          }
          if (response.response_code == 400 && response.status === "failed") {
            this.ui_controls.is_loading = false;
            this.error_notification(response.message);
          }
        },
        error: (e) => {
          console.error(e);
          this.error_notification("Unable to complete your request at this time.");
          this.ui_controls.is_loading = false;
        },
        complete: () => {
          console.info('complete');
        }
      }))
  }

  save_change() {
    this.update_payment.id = this.user_session.id;
    this.update_payment.token = this.user_session.token;
    this.update_payment.store_bank_name = this.store_single.store_bank_name;
    this.update_payment.store_account_name = this.store_single.store_account_name;
    this.update_payment.store_account_number = this.store_single.store_account_number;
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.update_payment, GlobalComponent.updateStorePayment)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.get_data();
            this.success_notification(response.message);
          }
          if (response.response_code == 200 && response.status === "failed") {
            this.ui_controls.is_loading = false;
            this.error_notification(response.message);
          }
          if (response.response_code == 400 && response.status === "failed") {
            this.ui_controls.is_loading = false;
            this.error_notification(response.message);
          }
        },
        error: (e) => {
          console.error(e);
          this.error_notification("Unable to complete your request at this time.");
          this.ui_controls.is_loading = false;
        },
        complete: () => {
          console.info('complete');
        }
      }))
  }

  error_notification(message: string) {
    this.toast.error(message);
  }
  success_notification(message: string) {
    this.toast.success(message);
  }
}
