import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TopComponent} from '../../partials/top/top.component';
import {SideComponent} from '../../partials/side/side.component';
import {TuiIcon} from '@taiga-ui/core';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';

@Component({
  selector: 'app-vendor-transactions',
  imports: [
    TopComponent,
    SideComponent,
    TuiIcon
  ],
  standalone: true,
  templateUrl: './vendor-transactions.component.html',
  styleUrl: './vendor-transactions.component.css'
})
export class VendorTransactionsComponent implements OnInit {
  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {}
  ui_controls = {
    is_loading: false
  };
  ngOnInit(): void {

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

  requestWidthdrawal() {

  }
}
