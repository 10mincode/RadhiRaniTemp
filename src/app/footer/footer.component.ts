import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
