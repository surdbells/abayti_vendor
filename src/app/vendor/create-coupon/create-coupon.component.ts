import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {SideComponent} from "../../partials/side/side.component";
import {TopComponent} from "../../partials/top/top.component";
import {TuiIcon} from "@taiga-ui/core";
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';

@Component({
  selector: 'app-create-coupon',
  standalone: true,
    imports: [
        RouterLink,
        SideComponent,
        TopComponent,
        TuiIcon
    ],
  templateUrl: './create-coupon.component.html',
  styleUrl: './create-coupon.component.css'
})
export class CreateCouponComponent implements OnInit {
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
  ngOnInit(): void {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = JSON.parse(atob(this.session_data));
    if (!this.user_session.is_active){
      this.router.navigate(['/', '']).then(r => console.log(r)); return;
    }
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

  createCoupon() {

  }
}
