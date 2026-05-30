import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastComponent } from './toast/toast.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  static apiLink: string = 'https://radhiranitempserver.onrender.com';
  // static apiLink: string = 'http://10.204.239.211:3000';
  //static apiLink: string = 'http://localhost:3000';
  title = 'radharani-homes';
}
