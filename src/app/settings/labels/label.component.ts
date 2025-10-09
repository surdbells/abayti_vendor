import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../global-component';
import {CommonModule} from '@angular/common';
import {SideComponent} from '../../partials/side/side.component';
import {TopComponent} from '../../partials/top/top.component';
import {TuiIcon, TuiLoader} from '@taiga-ui/core';
import {Labels} from '../../class/labels';
import {FormsModule} from '@angular/forms';
import {TUI_CONFIRM} from '@taiga-ui/kit';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';

@Component({
  selector: 'app-labels',
  standalone: true,
  imports: [
    CommonModule,
    SideComponent,
    TopComponent,
    TuiIcon,
    TuiLoader,
    FormsModule
  ],
  templateUrl: './label-component.html',
  styleUrl: './label.component.css'
})
export class LabelComponent implements OnInit {
  labels?: Labels[];
  private readonly dialogs = inject(TuiResponsiveDialogService);

  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}
  ui_controls = {
    is_loading: false,
    is_creating_label: false
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
  vendor_labels = {
    id: 0,
    token: ""
  };
  vendor_label_create = {
    id: 0,
    token: "",
    label: ""
  };
  update = {
    id: 0,
    token: "",
    label_id: 0,
    label: ""
  }
  delete = {
    id: 0,
    token: "",
    label_id: 0,
  }
  ngOnInit(): void {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    if (!this.user_session.is_active){
      this.router.navigate(['/', '']).then(r => console.log(r)); return;
    }
    this.vendor_labels.id = this.user_session.id;
    this.vendor_labels.token = this.user_session.token;

    this.delete.id = this.user_session.id;
    this.delete.token = this.user_session.token;

    this.update.id = this.user_session.id;
    this.update.token = this.user_session.token;

    this.vendor_label_create.id = this.user_session.id;
    this.vendor_label_create.token = this.user_session.token;
    this.get_vendor_labels();
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
  get_vendor_labels() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.vendor_labels, GlobalComponent.readLabel)
      .subscribe(({
        next: (response) => {
          this.labels =  response.data;
          this.ui_controls.is_loading = false;
        }
      }))
  }
  create_vendor_labels() {
    if (this.vendor_label_create.label.length === 0) {
      this.error_notification("Label name is required");
      return;
    }
    this.ui_controls.is_creating_label = true;
    this.crudService.post_request(this.vendor_label_create, GlobalComponent.createLabel)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.vendor_label_create.label = "";
            this.ui_controls.is_creating_label = false;
            this.success_notification(response.message);
            this.get_vendor_labels();
          }
          if (response.response_code == 200 && response.status === "failed") {
            this.ui_controls.is_creating_label = false;
            this.error_notification(response.message);
          }
          if (response.response_code == 400 && response.status === "failed") {
            this.ui_controls.is_creating_label = false;
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

  update_label(id: number, label: string) {
    if (this.update.label.length === 0) {
      this.error_notification("Empty label cannot be saved");
      return;
    }
    this.update.label_id = id;
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.update, GlobalComponent.updateLabel)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.success_notification(response.message);
            this.update.label = "";
            this.get_vendor_labels();
          }
          if (response.response_code == 200 && response.status === "failed") {
            this.ui_controls.is_creating_label = false;
            this.error_notification(response.message);
          }
          if (response.response_code == 400 && response.status === "failed") {
            this.ui_controls.is_creating_label = false;
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

  start_delete_label(id: number, name: string) {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirm delete',
        data: {
          content: 'Your label '+ name +' will be deleted permanently',
          yes: 'Delete',
          no: 'Cancel',
        },
      })
      .subscribe((response) => {
        if (response){
          this.deleteLabel(id);
        }
      });
  }
  deleteLabel(id: number){
    this.ui_controls.is_loading = true;
    this.delete.label_id = id;
    this.crudService.post_request(this.delete, GlobalComponent.deleteLabel)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.success_notification(response.message);
            this.get_vendor_labels();
          }
        }
      }))
  }
}
