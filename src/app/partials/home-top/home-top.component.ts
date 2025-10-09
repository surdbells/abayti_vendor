import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {LanguageSwitcherComponent} from '../../language-switcher.component';
import {TranslatePipe} from '../../translate.pipe';

@Component({
  selector: 'app-home-top',
  standalone: true,
  imports: [
    RouterLink,
    LanguageSwitcherComponent,
    TranslatePipe
  ],
  templateUrl: './home-top.component.html',
  styleUrl: './home-top.component.css'
})
export class HomeTopComponent {

}
