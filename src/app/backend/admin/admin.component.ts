import { Component } from '@angular/core';
import {TopComponent} from '../../partials/top/top.component';
import {AsideComponent} from '../../partials/aside/aside.component';

@Component({
  selector: 'app-admin',
  imports: [
    TopComponent,
    AsideComponent
  ],
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
