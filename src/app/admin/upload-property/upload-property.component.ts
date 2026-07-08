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
  isEditMode = false;
  existingThumbnail = ''; // stores existing thumbnail filename
  existingImages: string[] = []; // stores existing image filenames
  removedImages: string[] = []; // tracks which existing images to delete
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
    const editId = this.route.snapshot.queryParams['propertyId'];
    if (editId) {
      this.isEditMode = true;
      this.propertyId = editId;

      this.propertyService.getProjectById(editId).subscribe((property: any) => {
        // Patch basic fields
        this.propertyForm.patchValue({
          propertyId: property.propertyId,
          propertyName: property.propertyName,
          description: property.description,
          propertyType: property.propertyType,
          status: property.status,
          dateListed: property.dateListed,
          startingPrice: property.startingPrice,
          priceUnit: property.priceUnit,
          yearBuilt: property.yearBuilt,
          location: property.location,
          legalClearances: { reraId: property.legalClearances?.reraId || '' }
        });

        // Set approvedBy input field
        const approvedByInput = document.getElementById('approvedBy') as HTMLInputElement;
        if (approvedByInput) {
          approvedByInput.value = property.legalClearances?.approvedBy?.join(', ') || '';
        }

        // Set location dropdowns
        const stateObj = this.statecity.find(s => s.state === property.location?.state);
        this.citiesList = stateObj ? stateObj.cities : [];
        const cityObj = this.citiesList.find(c => c.city === property.location?.city);
        this.localitiesList = cityObj ? cityObj.localities : [];

        // Set landmarks
        property.location?.nearbyLandmarks?.forEach((lm: string) => {
          this.nearbyLandmarks.push(this.fb.control(lm));
        });

        // Set amenities + check checkboxes
        this.specificAmenities = AMENITIES[property.propertyType] || [];
        property.amenities?.forEach((amenity: string) => {
          this.amenities.push(this.fb.control(amenity));
        });
        setTimeout(() => {
          property.amenities?.forEach((amenity: string) => {
            const checkbox = document.getElementById(amenity) as HTMLInputElement;
            if (checkbox) checkbox.checked = true;
          });
        }, 500);

        // Set existing thumbnail
        this.existingThumbnail = property.media?.thumbnail || '';
        this.thumbnail = `${AppComponent.apiLink}/uploads/${property.media?.thumbnail}`;
        this.propertyForm.get('media.thumbnail')?.setValue(property.media?.thumbnail);

        // Set existing images
        this.existingImages = [...(property.media?.images || [])];
        property.media?.images?.forEach((img: string) => {
          this.imagePreviews.push(`${AppComponent.apiLink}/uploads/${img}`);
          this.images.push(this.fb.control(img)); // string = existing
        });

        // Set videos
        property.videoUrls?.forEach((videoId: string) => {
          this.videoUrls.push(this.fb.control(videoId));
        });
      });
    } else {
      this.isEditMode = false;
      this.propertyId = `PROP${Math.floor(100000 + Math.random() * 900000)}`;
      this.propertyForm.patchValue({
        dateListed: new Date().toISOString().split('T')[0],
        propertyId: this.propertyId
      });
    }
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
    const imageValue = this.images.at(index).value;
    // If it's a string (existing image filename) track it for deletion
    if (typeof imageValue === 'string') {
      this.removedImages.push(imageValue);
      this.existingImages = this.existingImages.filter(img => img !== imageValue);
    }
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
    this.approvedBy.clear();
    approvedByValue.split(',').forEach(item => {
      const trimmed = item.trim();
      if (trimmed) this.approvedBy.push(this.fb.control(trimmed));
    });

    if (this.propertyForm.valid) {
      const formData = new FormData();
      const media = this.propertyForm.get('media')?.value;

      // Thumbnail — only append if new file selected
      if (media.thumbnail instanceof File) {
        formData.append('thumbnail', media.thumbnail);
      } else {
        // Keep existing
        formData.append('existingThumbnail', this.existingThumbnail);
      }

      // Images — separate new files from existing strings
      const keepImages: string[] = [];
      this.images.controls.forEach((control) => {
        if (control.value instanceof File) {
          formData.append('images', control.value); // new file
        } else if (typeof control.value === 'string') {
          keepImages.push(control.value); // existing to keep
        }
      });

      formData.append('keepImages', JSON.stringify(keepImages));
      formData.append('removedImages', JSON.stringify(this.removedImages));

      const propertyCopy = { ...this.propertyForm.value };
      propertyCopy.media = {};
      formData.append('property', JSON.stringify(propertyCopy));

      if (this.isEditMode) {
        this.propertyService.updateProperty(this.propertyId, formData).subscribe(
          (res) => {
            alert('Property updated successfully! ✅');
            window.history.back();
          },
          (err) => {
            console.error('Update failed', err);
            alert('Update failed! ⚠️');
          }
        );
      } else {
        this.propertyService.uploadProperty(formData).subscribe(
          (res) => {
            alert('Property uploaded successfully! ✅');
            this.imagePreviews = [];
            this.images.clear();
            this.propertyForm.reset();
            this.ngOnInit();
          },
          (err) => {
            alert('Upload failed! ⚠️');
          }
        );
      }
    }
  }
}
