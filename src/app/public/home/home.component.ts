import {Component} from '@angular/core';
import {HomeTopComponent} from '../../partials/home-top/home-top.component';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '../../translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeTopComponent,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor() {
  }

}
