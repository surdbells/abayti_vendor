import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {SideComponent} from "../partials/side/side.component";
import {TopComponent} from "../partials/top/top.component";
import {TuiIcon, TuiLoader} from "@taiga-ui/core";
import {CrudService} from '../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {AsideComponent} from '../partials/aside/aside.component';
import {GlobalComponent} from '../global-component';

@Component({
  selector: 'app-page-template',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SideComponent,
    TopComponent,
    TuiIcon,
    TuiLoader,
    AsideComponent
  ],
  templateUrl: './page-template.component.html',
  styleUrl: './page-template.component.css'
})
export class PageTemplateComponent implements OnInit{

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
  }

  get_data = {
    id: 0,
    token: ""
  }

  goBack() {
    this.router.navigate(['/backend']).then(r => console.log(r));
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
