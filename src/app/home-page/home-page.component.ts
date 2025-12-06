import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../services/projects.service';
import { Property } from '../objects/property.model';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  standalone: true,
})
export class HomePageComponent implements OnInit {
  projects: Property[] = [];
  filteredProjects: Property[] = [];
  selectedFilter: string = 'all';
  api_url_point: string = `${AppComponent.apiLink}/uploads/`;
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
      this.projects = data;
      this.filteredProjects = data;
    });
  }
  filterProjects(type: string): void {
    this.selectedFilter = type;

    if (type === 'all') {
      this.filteredProjects = this.projects;
    } else {
      // project.propertyType should match button text
      this.filteredProjects = this.projects.filter((p) =>
        p.propertyType.toLowerCase().includes(type)
      );
    }
  }
  submitContact(form: NgForm): void {
    if (form.valid) {
      console.log('Form submitted:', form.value);
      this.contactService.sendContactForm(form.value).subscribe((res) => {
        if (res) {
          console.log(res);
          form.reset({ subject: '' });
        }
      });
      // send to backend here
    } else {
      console.warn('Form is invalid');
    }
  }
}
