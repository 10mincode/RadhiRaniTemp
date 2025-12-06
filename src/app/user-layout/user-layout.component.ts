import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-layout',
  imports: [
    RouterModule,
    CommonModule,
    FooterComponent,
    HeaderComponent,
    MatButtonModule,
  ],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css',
})
export class UserLayoutComponent {
  openWhatsApp() {
    window.open('https://wa.me/917728906753?text=Hii', '_blank');
  }
}
