import { Component, OnInit } from '@angular/core';
import { Property } from '../objects/property.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-property-page',
  templateUrl: './property-page.component.html',
  styleUrls: ['./property-page.component.css']
})
export class PropertyPageComponent implements OnInit {

  property!: Property;
  thumbnails = document.getElementsByClassName('thumbnail');
  mainImage: HTMLImageElement = document.getElementById('mainImage') as HTMLImageElement;;
  googleMapUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: ProjectsService
  ) { }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id')!;
    this.propertyService.getPropertyById(id).subscribe(data => {
      if (data) {
        this.property = data;
      }
    });
    this.thumbnails = document.getElementsByClassName('thumbnail');
    const lat = this.property.Location.Latitude;
    const lng = this.property.Location.Longitude;
    this.googleMapUrl = `https://maps.google.com/maps?width=100%25&height=400&hl=en&q=35,20+(RadhaRani%20Homes)&t=&z=14&ie=UTF8&iwloc=B&output=embed`;
    this.mainImage = document.getElementById('mainImage') as HTMLImageElement;
  }

  // changeImage(newImg: string) {
  //   this.property.Media.Thumbnail = newImg;
  // }

  submitEnquiry(form: any) {
    alert(`Thank you, ${form.name}! Your enquiry has been received.`);
  }

  changeImage(e: Event) {
    // Remove active class from all thumbnails
    const thumbnail = e.target as HTMLImageElement;
    Array.from(this.thumbnails).forEach(thumb => thumb.classList.remove('active'));

    // Add active class to clicked thumbnail
    thumbnail.classList.add('active');

    // Change main image source
    if (this.mainImage) {

      this.mainImage.src = thumbnail.src;
    }
  }
  scrollTo(section: string) {
    this.router.navigate([], { fragment: section });
    const el = document.getElementById(section);
    if (el) {
      const yOffset = -80; // 👈 header ki height ke hisaab se set kar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }


}
