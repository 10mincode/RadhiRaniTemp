import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-metrics-card',
  imports: [CommonModule],
  templateUrl: './metrics-card.component.html',
  styleUrls: ['./metrics-card.component.css', '../../selected-bootstrap.css'],
})
export class MetricsCardComponent {
  @Input() data: {
    views: number;
    enquiries: number;
    listings: number;
  } = { views: 0, enquiries: 0, listings: 0 };
  colors: string[] = [
    'rgb(22, 160, 133)', // Teal
    'rgb(243, 156, 18)', // Amber
    'rgb(46, 204, 113)', // Green
    'rgb(231, 76, 60)', // Red
    'rgb(142, 68, 173)', // Purple
  ];
  transparentColors: string[] = [
    'rgba(22, 160, 133,0.1)', // Teal
    'rgba(243, 156, 18,0.1)', // Amber
    'rgba(46, 204, 113,0.1)', // Green
    'rgba(231, 76, 60,0.1)', // Red
    'rgba(142, 68, 173,0.1)', // Purple
  ];
  metrics = [
    {
      title: 'Total Views',
      tooltip: 'Number of registered users on the platform',
      value: this.data.views || 0,
      icon: 'fas fa-eye',
    },
    {
      title: 'Total Enquirys',
      tooltip: 'Number of registered users on the platform',
      value: this.data.enquiries || 0,
      icon: 'fas fa-envelope',
    },
    {
      title: 'Total Listings',
      tooltip: 'Number of registered users on the platform',
      value: this.data.listings || 0,
      icon: 'fas fa-home',
    },
  ];
  ngOnChanges(changes: SimpleChanges) {
    if ('data' in changes) {
      this.metrics[0].value = this.data.views || 0;
      this.metrics[1].value = this.data.enquiries || 0;
      this.metrics[2].value = this.data.listings || 0;
    }
  }

  // Update metric values on input data change
}
