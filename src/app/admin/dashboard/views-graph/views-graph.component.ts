import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Tooltip,
  Legend,
  Title
);
@Component({
  selector: 'app-views-graph',
  imports: [BaseChartDirective],
  templateUrl: './views-graph.component.html',
  styleUrl: './views-graph.component.css',
})
export class ViewsGraphComponent {
  conversionPerMonth = [3.8, 4.7, 5.5, 4.8, 5.8, 6.5]; // (enquiries / views) * 100
  perDayChartData: ChartConfiguration<'bar' | 'line'>['data'] = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        type: 'line',
        label: 'Conversion Rate (%)',
        data: this.conversionPerMonth,
        borderColor: '#f6c23e',
        backgroundColor: 'rgba(246, 194, 62, 0.2)',
        pointBackgroundColor: '#f6c23e',
        yAxisID: 'y1',
        tension: 0.4,
        fill: true,
      },
      {
        type: 'bar',
        label: 'Views',
        data: [800, 950, 1100, 1050, 1200, 1300],
        backgroundColor: '#4e73df',
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Enquiries',
        data: [30, 45, 60, 50, 70, 85],
        backgroundColor: '#1cc88a',
        yAxisID: 'y',
      },
    ],
  };

  combinedChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ctx.dataset.label === 'Conversion Rate (%)'
              ? `${ctx.dataset.label}: ${ctx.raw}%`
              : `${ctx.dataset.label}: ${ctx.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        position: 'left',
        title: { display: true, text: 'Views & Enquiries' },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: { display: true, text: 'Conversion Rate (%)' },
        grid: { drawOnChartArea: false },
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  // Combined line chart for Views and Enquiries per Month
  perMonthChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        data: [800, 950, 1100, 1050, 1200, 1300],
        label: 'Views',
        borderColor: '#4e73df',
        backgroundColor: 'rgba(78, 115, 223, 0.2)',
        pointBackgroundColor: '#4e73df',
        tension: 0.4,
        fill: true,
      },
      {
        data: [30, 45, 60, 50, 70, 85],
        label: 'Enquiries',
        borderColor: '#1cc88a',
        backgroundColor: 'rgba(28, 200, 138, 0.2)',
        pointBackgroundColor: '#1cc88a',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: {},
      y: { beginAtZero: true },
    },
  };
}
