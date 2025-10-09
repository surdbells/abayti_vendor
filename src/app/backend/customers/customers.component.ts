import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {AsideComponent} from '../../partials/aside/aside.component';
import {NgForOf, NgIf} from '@angular/common';
import {TopComponent} from '../../partials/top/top.component';
import {TuiIcon, TuiLoader} from '@taiga-ui/core';
import {GlobalComponent} from '../../global-component';
import {Customers} from '../../class/customers';
import {DataTablesModule} from 'angular-datatables';
import {Config} from 'datatables.net';
import {TUI_CONFIRM} from '@taiga-ui/kit';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
import {AdminTopComponent} from "../../partials/admin-top/admin-top.component";

@Component({
  selector: 'app-customers',
  standalone: true,
    imports: [
        AsideComponent,
        NgIf,
        RouterLink,
        TopComponent,
        TuiIcon,
        TuiLoader,
        DataTablesModule,
        NgForOf,
        AdminTopComponent
    ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit{
  customers?: Customers[];
  dtOptions: Config = {};
  private readonly dialogs = inject(TuiResponsiveDialogService);

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

  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}

  ngOnInit() {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    this.get_data.id = this.user_session.id;
    this.get_data.token = this.user_session.token;

    this.activate.id = this.user_session.id;
    this.activate.token = this.user_session.token;

    this.deactivate.id = this.user_session.id;
    this.deactivate.token = this.user_session.token;
    this.get_customer();
  }
  get_data = {
    id: 0,
    token: ""
  }
  activate = {
    id: 0,
    token: "",
    customer: 0,
    status: true
  }
  deactivate = {
    id: 0,
    token: "",
    customer: 0,
    status: false
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


  get_customer() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_data, GlobalComponent.getCustomers)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.customers = response.data
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }
        }
      }))
  }
  start_activate(customer: number, name: string) {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirm',
        data: {
          content: ''+ name +' account will be activated ?',
          yes: 'Activate',
          no: 'Cancel',
        },
      })
      .subscribe((response) => {
        if (response){
          this.activate_customer(customer, name);
        }
      });
  }
  activate_customer(customer: number, name: string){
    this.ui_controls.is_loading = true;
    this.activate.customer = customer;
    this.crudService.post_request(this.activate, GlobalComponent.activateCustomer)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.success_notification(response.message);
            this.get_customer();
          }
        }
      }))
  }

  start_deactivate(customer: number, name: string) {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirm',
        data: {
          content: ''+ name +' will be deactivated?',
          yes: 'Deactivate',
          no: 'Cancel',
        },
      })
      .subscribe((response) => {
        if (response){
          this.deactivate_customer(customer, name);
        }
      });
  }
  deactivate_customer(customer: number, name: string){
    this.ui_controls.is_loading = true;
    this.deactivate.customer = customer;
    this.crudService.post_request(this.deactivate, GlobalComponent.deactivateCustomer)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.success_notification(response.message);
            this.get_customer();
          }
        }
      }))
  }
}
