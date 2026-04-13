import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../global-component';
import {AsideComponent} from '../../partials/aside/aside.component';
import {DataTablesModule} from 'angular-datatables';
import {NgForOf, NgIf} from '@angular/common';
import {TopComponent} from '../../partials/top/top.component';
import {TuiIcon, TuiLoader} from '@taiga-ui/core';
import {Config} from 'datatables.net';
import {AdminTopComponent} from '../../partials/admin-top/admin-top.component';
import {FormsModule} from '@angular/forms';
export interface Transaction {
  id: number;
  order_id: string;
  transaction_id: string;
  merchantReference: string;
  customer: string;
  total_paid: string;
  delivery_fee: string;
  status: string;
  created: string;
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
    FormsModule
  ],
  templateUrl: './processing.component.html',
  styleUrl: './processing.component.css'
})
export class ProcessingComponent implements OnInit{
  transaction?: Transaction[];
  dtOptions: Config = {};
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

    this.get_processing_s.id = this.user_session.id;
    this.get_processing_s.token = this.user_session.token

    this.get_processing_r.id = this.user_session.id;
    this.get_processing_r.token = this.user_session.token

    this.getProcessingById.id = this.user_session.id;
    this.getProcessingById.token = this.user_session.token
    this.get_processing();
  }
  getProcessingById = {
    id: 0,
    token: "",
    order: "",
  }
 get_processing_s = {
    id: 0,
    token: ""
  }
  get_processing_r = {
    id: 0,
    token: "",
    start_date: "",
    end_date: ""
  }
  goBack() {
    this.router.navigate(['/backend']).then(r => console.log(r));
  }

  get_processing() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_processing_s, GlobalComponent.processing)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.transaction = response.data;
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
  get_processingById(order: string) {
    this.getProcessingById.order = order;
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.getProcessingById, GlobalComponent.processingById)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.transaction = response.data;
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
  get_processing_range() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_processing_r, GlobalComponent.processing)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.transaction = response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }
        }
      }))
  }
  openPopup(route: string) {
    const baseUrl = window.location.origin; // e.g., https://myapp.com
    const fullUrl = `${baseUrl}/${route.replace(/^\/+/, '')}`;
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;
    const width = screenWidth * 0.8;
    const height = screenHeight * 0.8;
    const left = (screenWidth - width) / 2;
    const top = (screenHeight - height) / 2;
    const features = `
    width=${width},
    height=${height},
    left=${left},
    top=${top},
    scrollbars=yes,
    resizable=yes`.replace(/\s+/g, '');
    window.open(fullUrl, 'popupWindow', features);
  }

}
