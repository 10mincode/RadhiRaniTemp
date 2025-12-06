import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsCardComponent } from '../dashboard/metrics-card/metrics-card.component';
import { LatestContactsComponent } from './latest-contacts/latest-contacts.component';
import { ViewsGraphComponent } from './views-graph/views-graph.component';
import { LatestUploadsComponent } from './latest-uploads/latest-uploads.component';
import { ProjectsService } from 'src/app/services/projects.service';
import { Property } from 'src/app/objects/property.model';
import { AppComponent } from 'src/app/app.component';
import { ContactService } from 'src/app/services/contact.service';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MetricsCardComponent,
    LatestContactsComponent,
    ViewsGraphComponent,
    LatestUploadsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  metrics_data = { views: 1500, enquiries: 150, listings: 3 };
  api_url_point: string = `${AppComponent.apiLink}/uploads/`;
  properties: Property[] = [];
  constructor(
    private projectsService: ProjectsService,
    private contactService: ContactService
  ) {}
  ngOnInit(): void {
    this.projectsService.getProjects().subscribe((data) => {
      (data as Property[]).forEach((prop) => {
        prop.media.thumbnail = `${this.api_url_point}${prop.media.thumbnail}`;
        prop.media.images.forEach((img, index) => {
          prop.media.images[index] = `${this.api_url_point}${img}`;
        });
      });
      this.properties = data;
      this.contactService
        .getContactMessages()
        .subscribe(
          (_) =>
            (this.metrics_data = { ...this.metrics_data, enquiries: _.length })
        );
    });
  }
}
