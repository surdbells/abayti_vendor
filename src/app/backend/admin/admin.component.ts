import {Component, OnInit, ViewChild} from '@angular/core';
import {TopComponent} from '../../partials/top/top.component';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {CrudService} from '../../services/crud.service';
import {HotToastService} from '@ngneat/hot-toast';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip, NgApexchartsModule
} from "ng-apexcharts";
import {CommonModule} from '@angular/common';
import {GlobalComponent} from '../../global-component';
import {Products} from '../../class/products';
import {ROrders} from '../../class/recent';
import {TuiLoader} from '@taiga-ui/core';
import {DataTablesModule} from 'angular-datatables';
import {TranslatePipe} from '../../translate.pipe';
import {AsideComponent} from '../../partials/aside/aside.component';
import {AdminTopComponent} from '../../partials/admin-top/admin-top.component';
import {Config} from 'datatables.net';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
interface Action {
  id: string;
  title: string;
  desc: string;
  icon: string;      // bootstrap-icon class (without the `bi` prefix)
  route: string;     // router path to navigate to
  badge?: number;    // optional badge/count
}

@Component({
  selector: 'app-admin',
  imports: [AsideComponent, CommonModule, TopComponent, NgApexchartsModule, ChartComponent, TuiLoader, DataTablesModule, RouterLink, TranslatePipe, RouterLinkActive, AdminTopComponent],
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  dtOptions: Config = {};
  recent?: ROrders[];
  topProducts?: Products[];
  total_products = 0;
  total_orders = 0;
  pending_orders = 0;
  return_orders = 0;

  total_products_stats: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  total_orders_stats: Array<number> =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  pending_orders_stats: Array<number> =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  return_orders_stats: Array<number> =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {
    this.chartOptions = {};
  }
  ui_controls = {
    is_loading: false,
    no_recent: false,
    viewing_dashboard: true,
    viewing_recent_orders: false,
    viewing_menu: false
  };
  stats = {
    id: 0,
    token: ""
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
    this.get_dashboard();
  }
  error_notification(message: string) {
    this.toast.error(message);
  }
  success_notification(message: string) {
    this.toast.success(message);
  }
  sign_out(): void {
    this.success_notification("User logged out successfully.");
    this.router.navigate(['/']).then(r => console.log(r));
  }
  get_dashboard() {
    this.stats.id = this.user_session.id;
    this.stats.token = this.user_session.token;
    this.ui_controls.is_loading = true;
    this.crudService.post_request(this.stats, GlobalComponent.getAdminStats)
      .subscribe(({
        next: (response) => {
          if (response.response_code === 200 && response.status === "success") {
            this.ui_controls.is_loading = false;
            this.total_products =  response.total_products;
            this.total_orders =  response.total_orders;
            this.pending_orders =  response.pending_orders;
            this.return_orders =  response.return_orders;
            this.total_products_stats =  response.total_products_stats;
            this.total_orders_stats =  response.total_orders_stats;
            this.pending_orders_stats =  response.pending_orders_stats;
            this.return_orders_stats =  response.return_orders_stats;
            this.chartOptions = {
              series: [
                {
                  name: "PRODUCTS",
                  data: this.total_products_stats
                },
                {
                  name: "TOTAL ORDERS",
                  data: this.total_orders_stats
                },
                {
                  name: "PENDING ORDERS",
                  data: this.pending_orders_stats
                },
                {
                  name: "RETURNED ORDER",
                  data: this.return_orders_stats
                }
              ],
              chart: {
                type: "bar",
                height: 350
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "55%"
                }
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                show: true,
                width: 2,
                colors: ["transparent"]
              },
              xaxis: {
                categories: [
                  "Jan",
                  "Feb",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December"
                ]
              },
              yaxis: {
                title: {
                  text: ""
                }
              },
              fill: {
                opacity: 1
              },
              tooltip: {
                y: {
                  formatter: function(val) {
                    return "" + val;
                  }
                }
              }
            };
            this.recent =  response.data;
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10
            };
            if (response.message === 0){
              this.ui_controls.no_recent = true;
            }
          }
        }
      }))
  }
  actions: Action[] = [
    { id: 'vendors', title: 'Vendors', desc: 'Manage and onboard vendors', icon: 'shop', route: '/stores' },
    { id: 'customers', title: 'Customers', desc: 'View and manage customers', icon: 'people', route: '/customers' },
    { id: 'products', title: 'Products', desc: 'Track and manage products', icon: 'box-seam', route: '/admin_products' },
    { id: 'sales', title: 'Sales', desc: 'Monitor sales activities', icon: 'cart-check', route: '/adminsales' },
    { id: 'transactions', title: 'Transactions', desc: 'Manage financial records', icon: 'credit-card', route: '/admintransactions' },
    { id: 'tickets', title: 'Tickets', desc: 'Support and issue tracking', icon: 'ticket-detailed', route: '/admintickets' },
    { id: 'commissions', title: 'Commissions', desc: 'Track vendor commissions', icon: 'cash-coin', route: '/admincommissions' },
    { id: 'logistics', title: 'Logistics', desc: 'Manage deliveries & shipping', icon: 'truck', route: '/adminlogistics' },
   // { id: 'messages', title: 'Messages', desc: 'Chat and notifications', icon: 'chat-dots', route: '/messages' },
   // { id: 'auditlog', title: 'Audit log', desc: 'Platform wise user action logs', icon: 'list', route: '/auditloog' },
    { id: 'collections', title: 'Collections', desc: 'Collections management', icon: 'folder', route: '/collections' }
  ];
}
