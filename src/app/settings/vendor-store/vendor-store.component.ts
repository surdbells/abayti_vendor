import {Component, OnInit} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SideComponent} from '../../partials/side/side.component';
import {TopComponent} from '../../partials/top/top.component';
import {TuiIcon, TuiLoader} from '@taiga-ui/core';
import {Router} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../global-component';
import {AngularEditorConfig, AngularEditorModule} from '@kolkov/angular-editor';

@Component({
  selector: 'app-vendor-store',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SideComponent,
    TopComponent,
    TuiIcon,
    TuiLoader,
    FormsModule,
    CommonModule,
    AngularEditorModule
  ],
  templateUrl: './vendor-store.component.html',
  styleUrl: './vendor-store.component.css'
})
export class VendorStoreComponent implements OnInit {
  base64String : any;
  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}
  ui_controls = {
    is_loading: false
  };
  store_single = {
    store_name: "",
    store_address: "",
    store_status: false,
    store_approved: false,
    store_email: "",
    store_phone: "",
    store_description: "",
    store_logo: "../assets/img/placeholder-1.png",
    store_cover: "../assets/img/placeholder-1.png"

  }
  get_single = {
    id: 0,
    token: ""
  }
  update_store = {
    id: 0,
    token: "",
    store_name: "",
    store_address: "",
    store_email: "",
    store_phone: "",
    store_description: "",
    store_logo: "../assets/img/placeholder-1.png",
    store_cover: "../assets/img/placeholder-1.png",
  }
  update_status = {
    id: 0,
    token: "",
    store_status: false
  }
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
    this.get_single.id = this.user_session.id;
    this.get_single.token = this.user_session.token;
     this.get_data();
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

  get_data() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_single, GlobalComponent.getVendorStore)
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
          this.error_notification(e);
          this.ui_controls.is_loading = false;
        },
        complete: () => {
          console.info('complete');
        }
      }))
  }

  update_changes() {
    this.update_store.id = this.user_session.id;
    this.update_store.token = this.user_session.token;
    this.update_store.store_name = this.store_single.store_name;
    this.update_store.store_address = this.store_single.store_address;
    this.update_store.store_email = this.store_single.store_email;
    this.update_store.store_phone = this.store_single.store_phone;
    this.update_store.store_description = this.store_single.store_description;
    this.update_store.store_logo = this.store_single.store_logo;
    this.update_store.store_cover = this.store_single.store_cover;

    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.update_store, GlobalComponent.updateStoreBasic)
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
          this.error_notification(e);
          this.ui_controls.is_loading = false;
        },
        complete: () => {
          console.info('complete');
        }
      }))
  }
  change_store_status() {
    this.update_status.id = this.user_session.id;
    this.update_status.token = this.user_session.token;
    this.update_status.store_status = this.store_single.store_status;
    console.log(this.store_single);
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.update_status, GlobalComponent.updateStoreStatus)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.get_data();
            this.success_notification(response.message);
          }
          if (response.response_code === 200 && response.status === "failed") {
            this.ui_controls.is_loading = false;
            this.error_notification(response.message);
          }
          if (response.response_code === 400 && response.status === "failed") {
            this.ui_controls.is_loading = false;
            this.error_notification(response.message);
          }
        },
        error: (e) => {
          console.error(e);
          this.error_notification(e);
          this.ui_controls.is_loading = false;
        },
        complete: () => {
          console.info('complete');
        }
      }))
  }
  select_logo(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64String = reader.result as string;
      this.store_single.store_logo =  this.base64String;
    };
    if(file){ reader.readAsDataURL(file); }
  }
  select_cover(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64String = reader.result as string;
      this.store_single.store_cover =  this.base64String;
    };
    if(file){ reader.readAsDataURL(file); }
  }
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '250',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize'],
      ['insertImage','insertVideo']

    ]
  };
}
