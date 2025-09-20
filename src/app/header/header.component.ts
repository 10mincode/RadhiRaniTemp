import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
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
