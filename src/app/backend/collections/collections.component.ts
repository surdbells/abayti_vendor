import {Component, OnInit} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {SideComponent} from "../../partials/side/side.component";
import {TopComponent} from "../../partials/top/top.component";
import {TuiIcon, TuiLoader} from "@taiga-ui/core";
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {AsideComponent} from '../../partials/aside/aside.component';
import {GlobalComponent} from '../../global-component';
import {Labels} from '../../class/labels';
import {DataTablesModule} from 'angular-datatables';
import {Config} from 'datatables.net';
import {AdminTopComponent} from "../../partials/admin-top/admin-top.component";

@Component({
  selector: 'app-collections',
  standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        SideComponent,
        TopComponent,
        TuiIcon,
        TuiLoader,
        AsideComponent,
        DataTablesModule,
        AdminTopComponent
    ],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent implements OnInit{
  collections?: Labels[];
  dtOptions: Config = {};
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

  collection = {
    id: 0,
    token: ""
  }

  ngOnInit() {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    this.collection.id = this.user_session.id;
    this.collection.token = this.user_session.token;
    this.get_collections();
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
  get_collections() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.collection, GlobalComponent.readCollection)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.collections =  response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }
        }
      }))
  }

  edit_collection(id: number, label: string, is_active: boolean) {
    localStorage.setItem("ID", String(id));
    localStorage.setItem("NAME", label);
    localStorage.setItem("STATUS", String(is_active));
    this.router.navigate(['/edit_collection']).then(r => console.log(r));
  }
}
