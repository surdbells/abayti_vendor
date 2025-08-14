import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../services/crud.service';
import {Router, RouterLink} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../global-component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TuiLoader} from '@taiga-ui/core';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, TuiLoader, RouterLink],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  constructor(
    private crudService: CrudService,
    private router: Router,
    private cookieService: CookieService,
    private toast: HotToastService
  ) {}
  fieldTextType: boolean = false;
  ui_controls = {
    loading: false,
    registered: false
  };
  ngOnInit(): void {

  }
  register = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: ""
  };
  confirm = {
    otp: "",
    input_otp: "",
    expires_at: 0,
    email: ""
  };
  r_response = {
    otp: "",
    expires_at: 0
  };
  user_register() {
    if (this.register.first_name.length === 0) {
      this.error_notification("First name is required");
      return;
    }
    if (this.register.last_name.length === 0) {
      this.error_notification("Last name is required");
      return;
    }
    if (this.register.email.length === 0) {
      this.error_notification("Email address is required");
      return;
    }
    if (!GlobalComponent.validateEmail(this.register.email)) {
      this.error_notification("Invalid email format provided");
      return;
    }
    if (this.register.phone.length === 0) {
      this.error_notification("Phone number is required");
      return;
    }
    if (!GlobalComponent.validateNumber(this.register.phone)) {
      this.error_notification("Invalid phone number format provided");
      return;
    }
    if (this.register.password.length === 0) {
      this.error_notification("Password is required");
      return;
    }
    if (this.register.confirm_password.length === 0) {
      this.error_notification("Password does not match");
      return;
    }
    if (this.register.password != this.register.confirm_password) {
      this.error_notification("Password does not match");
      return;
    }

    this.ui_controls.loading = true;
    this.crudService.post_request(this.register, GlobalComponent.UserRegister)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.loading = false;
            this.ui_controls.registered = true;
            this.success_notification(response.message);
            this.r_response = response.data;
            this.confirm.otp = this.r_response.otp;
            this.confirm.expires_at = this.r_response.expires_at;
            this.confirm.email = this.register.email;
          }
          if (response.response_code == 200 && response.status === "failed") {
            this.ui_controls.loading = false;
            this.error_notification(response.message);
          }
          if (response.response_code == 400 && response.status === "failed") {
            this.ui_controls.loading = false;
            this.error_notification(response.message);
          }
        },
        error: (e) => {
          console.error(e);
          this.error_notification(e);
          this.ui_controls.loading = false;
        },
        complete: () => {
          console.info('complete');
        }
      }))
  }
  user_validate() {
    if (this.confirm.input_otp.length === 0) {
      this.error_notification("OTP is required");
      return;
    }
    this.ui_controls.loading = true;
    this.crudService.post_request(this.confirm, GlobalComponent.UserValidate)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.loading = false;
            this.success_notification(response.message);
            this.router.navigate(['/']).then(r => console.log(r));
          }
          if (response.response_code == 200 && response.status === "failed") {
            this.ui_controls.loading = false;
            this.error_notification(response.message);
          }
          if (response.response_code == 400 && response.status === "failed") {
            this.ui_controls.loading = false;
            this.error_notification(response.message);
          }
        },
        error: (e) => {
          console.error(e);
          this.error_notification(e);
          this.ui_controls.loading = false;
        },
        complete: () => {
          console.info('complete');
        }
      }))
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  error_notification(message: string) {
    this.toast.error(message);
  }
  success_notification(message: string) {
    this.toast.success(message);
  }
}

