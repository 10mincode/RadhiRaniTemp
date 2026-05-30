import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isHomeScreen = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isHomeScreen =
        this.router.url.split('#')[0] === '/' || this.router.url.split('#')[0] === '/home';
    });
  }
  logoClick() {
    this.router.navigate(['/'])
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

}
