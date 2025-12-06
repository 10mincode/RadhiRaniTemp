import { Component, OnInit } from '@angular/core';
import { Property } from '../objects/property.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { ContactService } from '../services/contact.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-property-page',
  templateUrl: './property-page.component.html',
  styleUrls: ['./property-page.component.css'],
  standalone: false,
})
export class PropertyPageComponent implements OnInit {
  property!: Property;
  thumbnails = document.getElementsByClassName('thumbnail');
  mainImage: HTMLImageElement = document.getElementById(
    'mainImage'
  ) as HTMLImageElement;
  googleMapUrl!: SafeResourceUrl;
  api_url_point: string = `${AppComponent.apiLink}/uploads/`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: ProjectsService,
    private contactService: ContactService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.propertyService.getProjectById(id).subscribe((data) => {
      if (data) {
        (
          data as Property
        ).media.thumbnail = `${this.api_url_point}${data.media.thumbnail}`;
        (data as Property).media.images.forEach((img, index) => {
          (data as Property).media.images[
            index
          ] = `${this.api_url_point}${img}`;
        });
        this.property = data;
        const lat = this.property.location.latitude;
        const lng = this.property.location.longitude;
        this.googleMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${lat},${lng}20+(RadhaRani%20Homes)&t=&z=14&ie=UTF8&iwloc=B&output=embed`
        );
      }
    });
    this.thumbnails = document.getElementsByClassName('thumbnail');

    this.mainImage = document.getElementById('mainImage') as HTMLImageElement;
  }

  // changeImage(newImg: string) {
  //   this.property.Media.Thumbnail = newImg;
  // }

  submitEnquiry(form: NgForm) {
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
    alert(`Thank you, ${form.value.name}! Your enquiry has been received.`);
  }

  changeImage(e: Event) {
    // Remove active class from all thumbnails
    const thumbnail = e.target as HTMLImageElement;
    Array.from(this.thumbnails).forEach((thumb) =>
      thumb.classList.remove('active')
    );

    // Add active class to clicked thumbnail
    thumbnail.classList.add('active');

    // Change main image source
    if (this.mainImage) {
      this.mainImage.src = thumbnail.src;
      //Scroll to div with id gallery
      document.getElementById('gallery')?.scrollIntoView();
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
