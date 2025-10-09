import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TuiIcon} from '@taiga-ui/core';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {LanguageSwitcherComponent} from "../../language-switcher.component";
import {GlobalComponent} from '../../global-component';
import {TranslatePipe} from '../../translate.pipe';

@Component({
  selector: 'app-side',
  imports: [RouterLink, TranslatePipe],
  standalone: true,
  templateUrl: './side.component.html',
  styleUrl: './side.component.css'
})
export class SideComponent implements OnInit {
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
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
  }
  error_notification(message: string) {
    this.toast.error(message);
  }
  success_notification(message: string) {
    this.toast.success(message);
  }
  sign_out(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.success_notification("User logged out successfully.");
    this.router.navigate(['/']).then(r => console.log(r));
  }


}
