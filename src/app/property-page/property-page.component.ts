import { Component, OnInit } from '@angular/core';
import { Property } from '../objects/property.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { ContactService } from '../services/contact.service';
import { NgForm } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { AMENITIES } from '../objects/amenities.constant';
import { PriceUnit } from '../objects/priceUnit.constant';

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
  enquiry_submit_loading = false;
  currentImageIndex = 0;
  galleryItems: {
    type: 'image' | 'video';
    src: string;
  }[] = [];
  touchStartX = 0;
  touchEndX = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: ProjectsService,
    private contactService: ContactService,
    private sanitizer: DomSanitizer,
    private toastService: ToastService
  ) { }

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
        this.galleryItems = this.galleryItems = [
          {
            type: 'image',
            src: this.property.media.thumbnail
          },
          ...this.property.videoUrls.map(videoId => ({
            type: 'video' as const,
            src: videoId
          })),

          ...this.property.media.images.map(img => ({
            type: 'image' as const,
            src: img
          })),
        ];
        if (sessionStorage.getItem(`viewed_${id}`) !== 'true') {
          this.propertyService.recordView(id).subscribe(
            (res) => sessionStorage.setItem(`viewed_${id}`, 'true'),
            (err) => console.error('View error:', err)
          );
        }
      }
    });
    this.thumbnails = document.getElementsByClassName('thumbnail');

    this.mainImage = document.getElementById('mainImage') as HTMLImageElement;
  }
  getIcon(amenity: string): string {
    return AMENITIES[this.property.propertyType].find((a) => a.label === amenity)?.icon || AMENITIES['Common'].find((a) => a.label === amenity)?.icon || 'fa-solid fa-check';
  }
  getPriceUnit(priceUnit: string) {
    return PriceUnit[priceUnit as keyof typeof PriceUnit] || priceUnit;
  }
  // changeImage(newImg: string) {
  //   this.property.Media.Thumbnail = newImg;
  // }
  getEmbedUrl(videoId: string): SafeResourceUrl {

    // Default to Rickroll if invalid
    console.log('Extracted Video ID:', videoId);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }
  submitEnquiry(form: NgForm) {
    if (form.valid) {
      this.enquiry_submit_loading = true;
      console.log('Form submitted:', form.value);
      this.contactService.sendContactForm(form.value).subscribe((res) => {
        this.enquiry_submit_loading = false;
        if (res) {
          this.toastService.show("Message Sent! \n\n You will get a follow back soon on your email", "success", 3000);
          console.log(res);
          form.reset({ subject: '' });
        } else {
          this.toastService.show("Failed to send message. Please try again later.", "error", 3000);
        }
      }, err => {
        this.enquiry_submit_loading = false;
        console.error('Error sending contact form:', err);
        this.toastService.show("An error occurred while sending your message. Please try again later.", "error", 3000);
      });
      // send to backend here
    } else {
      console.warn('Form is invalid');
    }
    alert(`Thank you, ${form.value.name}! Your enquiry has been received.`);
  }

  changeImage(i: number) {
    this.currentImageIndex = i;
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
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;

    // swipe left
    if (diff > 50) {
      this.nextImage();
    }

    // swipe right
    if (diff < -50) {
      this.prevImage();
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.galleryItems.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.galleryItems.length - 1;
    }
  }
}
