import {Component, OnInit} from '@angular/core';
import {AdminTopComponent} from '../../../partials/admin-top/admin-top.component';
import {DataTablesModule} from 'angular-datatables';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiIcon, TuiLoader} from '@taiga-ui/core';
import {Config} from 'datatables.net';
import {ActivatedRoute, Router} from '@angular/router';
import {CrudService} from '../../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {GlobalComponent} from '../../../global-component';
export interface Message {
  id: number;
  ticket: number;
  sender: string;
  message: string;
  timestamp: string;
}
@Component({
  selector: 'app-ticket-message',
  standalone: true,
  imports: [
    AdminTopComponent,
    DataTablesModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TuiIcon,
    TuiLoader,
    FormsModule
  ],
  templateUrl: './ticket-message.component.html',
  styleUrl: './ticket-message.component.css'
})
export class TicketMessageComponent implements OnInit{
  message?: Message[];
  dtOptions: Config = {};
  ui_controls = {
    is_loading: false,
    no_data: false
  };
  session_data: any = ""
  ticket_name: any = ""
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
  get_msg_t = {
    id: 0,
    token: "",
    ticket: 0
  }
  add_message = {
    id: 0,
    token: "",
    ticket: 0,
    message: ""

  }
  ngOnInit() {
    this.session_data = sessionStorage.getItem("SESSION");
    this.user_session = GlobalComponent.decodeBase64(this.session_data);
    const ticketId =  Number(this.route.snapshot.queryParamMap.get('id'));
    this.ticket_name =  this.route.snapshot.queryParamMap.get('name');

    this.get_msg_t.token = this.user_session.token;
    this.get_msg_t.id = this.user_session.id;
    this.get_msg_t.ticket = ticketId;

    this.add_message.token = this.user_session.token;
    this.add_message.id = this.user_session.id;
    this.add_message.ticket = ticketId;
    this.get_ticket_messages()
  }
  product = {
    token: '',
    id: 0,
    store: 0
  };
  goBack() {
    this.router.navigate(['/admintickets']).then(r => console.log(r));
  }

  get_ticket_messages() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_msg_t, GlobalComponent.ticketsMessages)
      .subscribe(({ next: (response) => {
            this.message = response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }

      }))
  }
 send_messages() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.add_message, GlobalComponent.sendTicketMessage)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.add_message.message = "";
            this.ui_controls.is_loading = false;
            this.success_notification(response.message);
            this.get_ticket_messages();
          }
        }
      }))
  }
  error_notification(message: string) {
    this.toast.error(message);
  }
  success_notification(message: string) {
    this.toast.success(message);
  }
}
