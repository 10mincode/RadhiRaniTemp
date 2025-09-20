import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../services/projects.service';
import { Property } from '../objects/property.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  projects: Property[] = [];
  filteredProjects: Property[] = [];
  selectedFilter: string = 'all';

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe((data) => {
      this.projects = data;
      this.filteredProjects = data;
    });
  }
  filterProjects(type: string): void {
    this.selectedFilter = type;

    if (type === 'all') {
      this.filteredProjects = this.projects;
    } else {
      // project.PropertyType should match button text
      this.filteredProjects = this.projects.filter(
        p => p.PropertyType.toLowerCase().includes(type)
      );
    }
  }
  submitContact(form: NgForm): void {
    console.log(form.value);

  }

}
