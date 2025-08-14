import {Component, OnInit, ViewChild} from '@angular/core';
import {SideComponent} from '../../partials/side/side.component';
import {TopComponent} from '../../partials/top/top.component';
import {Router} from '@angular/router';
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
@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  imports: [SideComponent, CommonModule, TopComponent,NgApexchartsModule, ChartComponent],
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(
    private router: Router,
    private crudService: CrudService,
    private toast: HotToastService,
  ) {
    this.chartOptions = {
      series: [
        {
          name: "Sales",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 61, 58,]
        },
        {
          name: "Orders",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 101, 98, 87]
        },
        {
          name: "Profit",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 26, 45, 48]
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
          text: "AED"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$ " + val;
          }
        }
      }
    };

  }
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
    this.user_session = JSON.parse(atob(this.session_data));
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
}
