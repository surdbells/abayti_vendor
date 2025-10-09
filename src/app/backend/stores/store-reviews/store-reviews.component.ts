import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CrudService} from '../../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../../global-component';
import {AsideComponent} from '../../../partials/aside/aside.component';
import {NgIf} from '@angular/common';
import {TopComponent} from '../../../partials/top/top.component';
import {TuiIcon, TuiLoader} from '@taiga-ui/core';
import {AdminTopComponent} from '../../../partials/admin-top/admin-top.component';

@Component({
  selector: 'app-store-reviews',
  standalone: true,
  imports: [
    AsideComponent,
    NgIf,
    RouterLink,
    TopComponent,
    TuiIcon,
    TuiLoader,
    AdminTopComponent
  ],
  templateUrl: './store-reviews.component.html',
  styleUrl: './store-reviews.component.css'
})
export class StoreReviewsComponent implements OnInit{

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
  }

  get_data = {
    id: 0,
    token: ""
  }

  goBack() {
    this.router.navigate(['/stores']).then(r => console.log(r));
  }
  error_notification(message: string) {
    this.toast.error(message);
  }
  success_notification(message: string) {
    this.toast.success(message);
  }

  get_post() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_data, GlobalComponent.baseURL)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
          }
        }
      }))
  }
}
