import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {AsideComponent} from '../../partials/aside/aside.component';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {TopComponent} from '../../partials/top/top.component';
import {TuiIcon, TuiLoader} from '@taiga-ui/core';
import {Stores} from '../../class/stores';
import {Config} from 'datatables.net';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
import {GlobalComponent} from '../../global-component';
import {TUI_CONFIRM} from '@taiga-ui/kit';
import {DataTablesModule} from 'angular-datatables';
import {AdminTopComponent} from '../../partials/admin-top/admin-top.component';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [
    AsideComponent,
    NgIf,
    RouterLink,
    TopComponent,
    TuiIcon,
    CommonModule,
    TuiLoader,
    DataTablesModule,
    NgForOf,
    AdminTopComponent
  ],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.css'
})
export class StoresComponent implements OnInit{
  stores?: Stores[];
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
    is_store: false
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

    this.delete.id = this.user_session.id;
    this.delete.token = this.user_session.token;
    this.get_store();
  }
  get_data = {
    id: 0,
    token: ""
  }
  activate = {
    id: 0,
    token: "",
    store: 0,
    status: true
  }
  delete = {
    id: 0,
    token: "",
    store: 0,
    status: false
  }
  deactivate = {
    id: 0,
    token: "",
    store: 0,
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

  get_store() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_data, GlobalComponent.getStores)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.stores = response.data
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10,
              order: [0,"desc"]
            };
          }
        }
      }))
  }
  start_activate(store: number, name: string) {
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
          this.activate_store(store, name);
        }
      });
  }
  activate_store(store: number, name: string){
    this.ui_controls.is_loading = true;
    this.activate.store = store;
    this.crudService.post_request(this.activate, GlobalComponent.activateStore)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.success_notification(response.message);
            this.get_store();
          }
        }
      }))
  }

  start_deactivate(store: number, name: string) {
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
          this.deactivate_store(store, name);
        }
      });
  }
  deactivate_store(store: number, name: string){
    this.ui_controls.is_loading = true;
    this.deactivate.store = store;
    this.crudService.post_request(this.deactivate, GlobalComponent.deactivateStore)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.success_notification(response.message);
            this.get_store();
          }
        }
      }))
  }
  start_delete(store: number, name: string) {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirm',
        data: {
          content: ''+ name +' will be deleted ?',
          yes: 'Deactivate',
          no: 'Cancel',
        },
      })
      .subscribe((response) => {
        if (response){
          this.delete_store(store, name);
        }
      });
  }
  delete_store(store: number, name: string){
    this.ui_controls.is_loading = true;
    this.delete.store = store;
    this.crudService.post_request(this.delete, GlobalComponent.deleteStore)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.success_notification(response.message);
            this.get_store();
          }
        }
      }))
  }

  store_orders(id: number, name: string) {
    const urlTree = this.router.createUrlTree(
      ['/store_orders'],
      { queryParams: { id, name } });
    const fullUrl = this.router.serializeUrl(urlTree);
    window.open(fullUrl, '_blank');
  }
  store_messages(id: number, name: string) {
    const urlTree = this.router.createUrlTree(['/store_messages'], { queryParams: { id, name } });
    const fullUrl = this.router.serializeUrl(urlTree);
    window.open(fullUrl, '_blank');
  }

  manage_store(id: number, name: string) {
    const urlTree = this.router.createUrlTree(['/manage_store'], { queryParams: { id, name } });
    const fullUrl = this.router.serializeUrl(urlTree);
    window.open(fullUrl, '_blank');
  }

  store_tickets(id: number, name: string) {
    const urlTree = this.router.createUrlTree(['/store_tickets'], { queryParams: { id, name } });
    const fullUrl = this.router.serializeUrl(urlTree);
    window.open(fullUrl, '_blank');
  }

  store_reviews(id: number, name: string) {
    const urlTree = this.router.createUrlTree(['/store_reviews'], { queryParams: { id, name } });
    const fullUrl = this.router.serializeUrl(urlTree);
    window.open(fullUrl, '_blank');
  }

  store_products(id: number, name: string) {
    const urlTree = this.router.createUrlTree(['/store_products'], { queryParams: { id, name } });
    const fullUrl = this.router.serializeUrl(urlTree);
    window.open(fullUrl, '_blank');
  }
  store_sales(id: number, name: string) {
    const urlTree = this.router.createUrlTree(['/store_sales'], { queryParams: { id, name } });
    const fullUrl = this.router.serializeUrl(urlTree);
    window.open(fullUrl, '_blank');
  }

}
