import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from '../../objects/property.model';
import { ProjectsService } from '../../services/projects.service';
import { AppComponent } from '../../app.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LatestContactsComponent } from '../dashboard/latest-contacts/latest-contacts.component';
import { MetricsCardComponent } from '../dashboard/metrics-card/metrics-card.component';
import { ContactService } from 'src/app/services/contact.service';
@Component({
  selector: 'app-addmin-property-page',
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    LatestContactsComponent,
    MetricsCardComponent,
  ],
  templateUrl: './property-page.component.html',
  styleUrls: ['./property-page.component.css'],
})
export class PropertyPageComponent {
  property!: Property;
  thumbnails = document.getElementsByClassName('thumbnail');
  mainImage: HTMLImageElement = document.getElementById(
    'mainImage'
  ) as HTMLImageElement;
  api_url_point: string = `${AppComponent.apiLink}/uploads/`;
  data: {
    views: number;
    enquiries: number;
    listings: number;
  } = { views: 0, enquiries: 0, listings: 1 };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: ProjectsService,
    private contactService: ContactService
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
        this.contactService
          .getContactMessagesByPropertyId(this.property.propertyId)
          .subscribe(
            (res) =>
              (this.data = {
                ...this.data,
                enquiries: res.length,
              })
          );
      }
    });
    this.thumbnails = document.getElementsByClassName('thumbnail');

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
