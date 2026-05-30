import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../services/projects.service';
import { Property } from '../objects/property.model';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { ContactService } from '../services/contact.service';
import { ToastService } from '../services/toast.service';
import { PriceUnit } from '../objects/priceUnit.constant';
import { LocalityService } from '../services/locality.service';

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
  contact_submit_loading = false;
  allLocalities: string[] = [];
  constructor(
    private projectsService: ProjectsService,
    private localityService: LocalityService,
    private contactService: ContactService,
    private toastService: ToastService,
    private router: Router
  ) { }

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
    this.localityService.getLocalities().subscribe((localities) => {
      this.allLocalities = localities.map(loc => loc.locality);
    });

  }
  onLocalityClick(locality: string): void {
    this.router.navigate(['/properties'], { queryParams: { locality } });
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
  getPriceUnit(priceUnit: string) {
    return PriceUnit[priceUnit as keyof typeof PriceUnit] || priceUnit;
  }
  submitContact(form: NgForm): void {
    if (form.valid) {
      this.contact_submit_loading = true;
      console.log('Form submitted:', form.value);
      this.contactService.sendContactForm(form.value).subscribe((res) => {
        this.contact_submit_loading = false;
        if (res) {
          this.toastService.show("Message Sent! \n\n You will get a follow back soon on your email", "success", 3000);
          form.reset({ subject: '' });
        }
        else {
          this.toastService.show("Failed to send message. Please try again later.", "error", 3000);
        }
      }, err => {
        this.contact_submit_loading = false;
        console.error('Error sending contact form:', err);
        this.toastService.show("An error occurred while sending your message. Please try again later.", "error", 3000);
      });
      // send to backend here
    } else {
      console.warn('Form is invalid');
    }
  }
}
