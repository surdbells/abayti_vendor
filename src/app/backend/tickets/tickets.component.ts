import {Component, inject, OnInit} from '@angular/core';
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
import {TUI_CONFIRM} from '@taiga-ui/kit';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
export interface Tickets {
  ticket_id: number;
  ticket_ref: string;
  subject: string;
  message: string;
  priority: string;
  store_name: string;
  messages: number;
  status: string;
  created: string;
  updated: string;
  minutes_after_created: number;
  minutes_after_updated: number;
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
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit{
  tickets?: Tickets[];
  private readonly dialogs = inject(TuiResponsiveDialogService);
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
    this.get_ticket.id = this.user_session.id;
    this.get_ticket.token = this.user_session.token

    this.get_ticket_status.id = this.user_session.id;
    this.get_ticket_status.token = this.user_session.token

    this.get_ticket_priority.id = this.user_session.id;
    this.get_ticket_priority.token = this.user_session.token

    this.status.id = this.user_session.id;
    this.status.token = this.user_session.token

    this.priority.id = this.user_session.id;
    this.priority.token = this.user_session.token
    this.get_tickets();
  }

  get_ticket = {
    id: 0,
    token: ""
  }
  get_ticket_priority = {
    id: 0,
    token: "",
    priority: "high"
  }
  get_ticket_status = {
    id: 0,
    token: "",
    status: "open"
  }

  status = {
    id: 0,
    token: "",
    ticket: 0,
    status: ""
  }
  priority = {
    id: 0,
    token: "",
    ticket: 0,
    priority: ""
  }

  goBack() {
    this.router.navigate(['/backend']).then(r => console.log(r));
  }

  get_tickets() {
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_ticket, GlobalComponent.tickets)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.tickets = response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }
        }
      }))
  }

  get_ticketPriority(event: Event) {
    this.get_ticket_priority.priority = (event.target as HTMLSelectElement).value;
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_ticket_priority, GlobalComponent.tickets)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.tickets = response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
          }
        }
      }))
  }
  start_changeStatus(ticket: number, subject: string, status: string) {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirm',
        data: {
          content: 'Ticket [ '+ subject +' ] status will be changed to ' + status,
          yes: 'Continue',
          no: 'Cancel',
        },
      })
      .subscribe((response) => {
        if (response){
          this.change_status(ticket, subject, status);
        }
      });
  }
  change_status(ticket: number, subject: string, status: string){
    this.ui_controls.is_loading = true;
    this.status.status = status;
    this.status.ticket = ticket;
    this.crudService.post_request(this.status, GlobalComponent.ticketsStatus)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.success_notification(response.message);
            this.get_tickets();
          }
        }
      }))
  }
  start_changePriority(ticket: number, subject: string, priority: string) {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Confirm',
        data: {
          content: 'Ticket [ '+ subject +' ] priority will be changed to ' + priority,
          yes: 'Continue',
          no: 'Cancel',
        },
      })
      .subscribe((response) => {
        if (response){
          this.change_priority(ticket, subject, priority);
        }
      });
  }
  change_priority(ticket: number, subject: string, priority: string){
    this.ui_controls.is_loading = true;
    this.priority.ticket = ticket;
    this.priority.priority = priority;
    this.crudService.post_request(this.priority, GlobalComponent.ticketsPriority)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.success_notification(response.message);
            this.get_tickets();
          }
        }
      }))
  }
  get_ticketStatus(event: Event) {
    this.get_ticket_status.status = (event.target as HTMLSelectElement).value;
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.get_ticket_status, GlobalComponent.tickets)
      .subscribe(({ next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.tickets = response.data;
            this.ui_controls.is_loading = false;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
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
  manage_ticket(id: number, name: string) {
    const urlTree = this.router.createUrlTree(['/ticket_messages'], { queryParams: { id, name } });
    const fullUrl = this.router.serializeUrl(urlTree);
    window.open(fullUrl, '_blank');
  }
}
