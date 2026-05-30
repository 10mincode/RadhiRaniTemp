import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
// Import ReactiveFormsModule instead of FormsModule 9501762561
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MapModule } from '@progress/kendo-angular-map';
import { MapComponent, TileUrlTemplateArgs } from '@progress/kendo-angular-map';
import { AppComponent } from 'src/app/app.component';
import { ProjectsService } from 'src/app/services/projects.service';
import { AddLocalityComponent } from '../add-locality/add-locality.component';
import { LocalityService } from 'src/app/services/locality.service';
import { StateCityLocality } from 'src/app/objects/locality.model';
import { AMENITIES, Amenity } from 'src/app/objects/amenities.constant';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-property',
  standalone: true, // It's good practice to make new components standalone
  // Add ReactiveFormsModule to imports
  imports: [ReactiveFormsModule, CommonModule, AddLocalityComponent],
  templateUrl: './upload-property.component.html',
  styleUrl: './upload-property.component.css',
})
export class UploadPropertyComponent {
  propertyId: string = '';
  showAddLocality: boolean = false;
  statecity: StateCityLocality[] = [];
  citiesList: { city: string, localities: string[] }[] = [];
  localitiesList: string[] = [];
  propertyForm: FormGroup;
  imagePreviews: string[] = []; // For storing image previews
  thumbnail: string | ArrayBuffer | null = null; // For storing thumbnail preview
  proceed: any;
  commonAmenities: Amenity[] = AMENITIES['Common'];
  specificAmenities: Amenity[] = [];
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private propertyService: ProjectsService,
    private localityService: LocalityService
  ) {
    this.propertyForm = this.fb.group({
      // Initialize propertyId here to link it to the form control
      propertyId: [''],
      propertyName: ['', Validators.required],
      location: this.fb.group({
        address: [''],
        city: [''],
        locality: [''],
        state: [''],
        postalCode: [''],
        nearbyLandmarks: this.fb.array([]),
      }),
      description: [''],
      propertyType: ['', Validators.required],
      status: ['', Validators.required],
      dateListed: [''],
      dateUpdated: [''],
      startingPrice: [''],
      priceUnit: [''],
      minBookingAmount: [],
      propertyAge: [''],
      yearBuilt: [null],
      legalClearances: this.fb.group({
        reraId: [''],
        approvedBy: this.fb.array([]),
      }),
      amenities: this.fb.array([]),

      media: this.fb.group({
        thumbnail: [''],
        images: this.fb.array([]),
      }),
      videoUrls: this.fb.array([]),
    });
    const admin = localStorage.getItem('admin');
    if (admin) {
      this.proceed = true;
    }

  }

  ngOnInit(): void {
    this.refreshLocalities();
    this.propertyId = `PROP${Math.floor(100000 + Math.random() * 900000)}`;
    this.propertyForm.patchValue({
      dateListed: new Date().toISOString().split('T')[0],
    });
    // Set the generated ID in the form control
    this.propertyForm.patchValue({ propertyId: this.propertyId });
    //const admin_id = this.route.snapshot.paramMap.get('admin_id')!;
  }
  onAmenityChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.amenities.push(this.fb.control(input.value));
    } else {
      const index = this.amenities.controls.findIndex(
        (x) => x.value === input.value
      );
      if (index !== -1) {
        this.amenities.removeAt(index);
      }
    }
  }

  onPropertyTypeChange(event: any) {
    const type = event.target.value;
    this.specificAmenities = AMENITIES[type] || [];
    // reset amenities on type change
    (this.propertyForm.get('amenities') as FormArray).clear();
  }
  onFilesSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.id === 'thumbnail') {
      if (input.files && input.files.length == 1) {
        const file = input.files[0];
        this.propertyForm.patchValue({ media: { thumbnail: file } });
        // create preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.thumbnail = e.target.result; // base64 string push karega
        };
        reader.readAsDataURL(file);
      }
    } else if (input.files && input.files.length > 0) {
      this.imagePreviews = [];
      this.images.clear(); // Clear previous images
      for (let i = 0; i < input.files.length; i++) {
        this.images.push(this.fb.control(input.files[i]));
        const file = input.files[i];
        // create preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews[i] = e.target.result; // base64 string push karega
        };
        reader.readAsDataURL(file);
      }
    }
  }
  onStateSelected(event: any) {
    const state = event.target.value;
    const selectedStateObj = this.statecity.find(s => s.state === state);
    this.citiesList = selectedStateObj ? selectedStateObj.cities : [];
    console.log('City List', this.citiesList);
    this.propertyForm.get('location.city')?.setValue('');
    this.propertyForm.get('location.locality')?.setValue('');

  }
  onCitySelected(event: any) {
    const city = event.target.value;
    const selectedCityObj = this.citiesList.find(c => c.city === city);
    this.localitiesList = selectedCityObj ? selectedCityObj.localities : [];
    console.log('Localities List', this.localitiesList);
    this.propertyForm.get('location.locality')?.setValue('');

  }
  removeLandmark(index: number) {
    this.nearbyLandmarks.removeAt(index);
  }
  addnearByLandmark() {
    let ln = (document.getElementById('landmarkn') as HTMLInputElement);
    let ld = (document.getElementById('landmarkd') as HTMLInputElement);
    if (ln.value === '') {
      alert('Landmark name cannot be empty');
      return;
    } else if (ld.value === '' || isNaN(Number(ld.value)) || Number(ld.value) < 0) {
      alert('Enter valid distance');
      return;
    }

    this.nearbyLandmarks.push(this.fb.control(`${ln.value} (${ld.value} km)`));
    ln.value = '';
    ld.value = '';
  }

  removeImage(index: number) {
    this.images.removeAt(index);
    this.imagePreviews.splice(index, 1);
  }
  removeVideo(index: number) {
    this.videoUrls.removeAt(index);
  }
  extractYoutubeId(url: string): string | null {

    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;

    const match = url.match(regex);

    return match ? match[1] : null;
  }
  getEmbedUrl(videoId: string): SafeResourceUrl {

    // Default to Rickroll if invalid
    console.log('Extracted Video ID:', videoId);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }
  get nearbyLandmarks() {
    return this.propertyForm.get('location.nearbyLandmarks') as FormArray;
  }

  get approvedBy() {
    return this.propertyForm.get('legalClearances.approvedBy') as FormArray;
  }

  get amenities() {
    return this.propertyForm.get(
      'amenities'
    ) as FormArray;
  }

  get images() {
    return this.propertyForm.get('media.images') as FormArray;
  }

  get videoUrls() {
    return this.propertyForm.get('videoUrls') as FormArray;
  }
  addVideo(url: string) {

    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/).+$/;

    if (!regex.test(url)) {
      alert('Enter valid YouTube URL');
      return;
    }

    this.videoUrls.push(this.extractYoutubeId(url) ? this.fb.control(this.extractYoutubeId(url)) : this.fb.control(''));
  }
  addLandmark() {
    this.nearbyLandmarks.push(this.fb.control(''));
    //Clear the fields of landmarkn and landmarkd
  }

  addApprover() {
    this.approvedBy.push(this.fb.control(''));
  }

  addAmenity() {
    this.amenities.push(this.fb.control(''));
  }

  addImage() {
    this.images.push(this.fb.control(''));
  }
  refreshLocalities() {
    this.localityService.getStateCityLocalityArray().subscribe(data => {
      this.statecity = data;
      console.log('State-City-Locality data:', this.statecity);
      this.propertyForm.get('location.state')?.reset();
      this.propertyForm.get('location.city')?.reset();
      this.propertyForm.get('location.locality')?.reset();
    });
  }

  submit() {

    let approvedByValue = (document.getElementById('approvedBy') as HTMLInputElement).value;

    // Clear existing first
    this.approvedBy.clear();

    // Push each string separately
    approvedByValue.split(',').forEach(item => {
      const trimmed = item.trim();
      if (trimmed) this.approvedBy.push(this.fb.control(trimmed));
    });
    if (this.propertyForm.valid) {
      const formData = new FormData();
      const media = this.propertyForm.get('media')?.value;

      // append files
      formData.append('thumbnail', media.thumbnail);
      media.images.forEach((img: File) => {
        formData.append('images', img);
      });


      // send form WITHOUT media files
      const propertyCopy = { ...this.propertyForm.value };
      propertyCopy.media = {}; // clear media completely
      formData.append('property', JSON.stringify(propertyCopy));

      this.propertyService.uploadProperty(formData).subscribe(
        (res) => {
          console.log('Saved successfully', res);
          this.imagePreviews = [];
          this.images.clear();
          this.propertyForm.reset();
          this.ngOnInit();
          alert('Property uploaded successfully! ✅');
        },
        (err) => {
          console.error('Upload failed', err);
          alert('Upload failed! ⚠️');
        }
      );
    }
  }
}
