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

@Component({
  selector: 'app-upload-property',
  standalone: true, // It's good practice to make new components standalone
  // Add ReactiveFormsModule to imports
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './upload-property.component.html',
  styleUrl: './upload-property.component.css',
})
export class UploadPropertyComponent {
  propertyId: string = '';
  propertyForm: FormGroup;
  imagePreviews: string[] = []; // For storing image previews
  thumbnail: string | ArrayBuffer | null = null; // For storing thumbnail preview
  proceed: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private propertyService: ProjectsService
  ) {
    this.propertyForm = this.fb.group({
      // Initialize propertyId here to link it to the form control
      propertyId: [''],
      propertyName: ['', Validators.required],
      location: this.fb.group({
        address: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        latitude: [null],
        longitude: [null],
        nearbyLandmarks: this.fb.array([]),
      }),
      description: [''],
      propertyType: ['', Validators.required],
      status: ['', Validators.required],
      dateListed: [''],
      dateUpdated: [''],
      actualPrice: [''],
      showcasePrice: [],
      pricePerSqFt: [],
      minBookingAmount: [],
      furnishing: [''],
      facing: [''],
      propertyAge: [''],
      legalClearances: this.fb.group({
        reraId: [''],
        approvedBy: this.fb.array([]),
      }),
      features: this.fb.group({
        bedrooms: [null],
        bathrooms: [null],
        areaSqFt: [null],
        floor: [''],
        totalFloors: [null],
        yearBuilt: [null],
        amenities: this.fb.group({
          parks: [false],
          garden: [false],
          swimmingPool: [false],
          gym: [false],
          security: [false],
          parking: [false],
          playArea: [false],
          clubHouse: [false],
          shoppingCenter: [false],
          publicTransport: [false],
          cCRoads: [false],
          powerBackup: [false],
          waterSupply: [false],
          wideSewage: [false],
          rainWaterHarvesting: [false],
          fireSafety: [false],
          smartHome: [false],
          petFriendly: [false],
          MovieHall: [false],
          accessibility: this.fb.array([]),
        }),
      }),
      media: this.fb.group({
        thumbnail: [''],
        images: this.fb.array([]),
      }),
    });
    const admin = localStorage.getItem('admin');
    if (admin) {
      this.proceed = true;
    }
  }

  ngOnInit(): void {
    this.propertyId = `PROP${Math.floor(100000 + Math.random() * 900000)}`;
    this.propertyForm.patchValue({
      dateListed: new Date().toISOString().split('T')[0],
    });
    // Set the generated ID in the form control
    this.propertyForm.patchValue({ propertyId: this.propertyId });
    //const admin_id = this.route.snapshot.paramMap.get('admin_id')!;
  }
  onAccesibilityChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.accessibility.push(this.fb.control(input.id));
    } else {
      const index = this.accessibility.controls.findIndex(
        (x) => x.value === input.id
      );
      if (index !== -1) {
        this.accessibility.removeAt(index);
      }
    }
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
          this.imagePreviews.push(e.target.result); // base64 string push karega
        };
        reader.readAsDataURL(file);
      }
    }
  }
  removeLandmark(index: number) {
    this.nearbyLandmarks.removeAt(index);
  }
  addnearByLandmark() {
    let ln = (document.getElementById('landmarkn') as HTMLInputElement).value;
    let ld = (document.getElementById('landmarkd') as HTMLInputElement).value;
    if (ln === '') {
      alert('Landmark name cannot be empty');
      return;
    } else if (ld === '' || isNaN(Number(ld)) || Number(ld) < 0) {
      alert('Enter valid distance');
      return;
    }
    this.nearbyLandmarks.push(this.fb.control(`${ln} (${ld} km)`));
  }

  removeImage(index: number) {
    this.images.removeAt(index);
    this.imagePreviews.splice(index, 1);
  }

  get nearbyLandmarks() {
    return this.propertyForm.get('location.nearbyLandmarks') as FormArray;
  }

  get approvedBy() {
    return this.propertyForm.get('legalClearances.approvedBy') as FormArray;
  }

  get accessibility() {
    return this.propertyForm.get(
      'features.amenities.accessibility'
    ) as FormArray;
  }

  get images() {
    return this.propertyForm.get('media.images') as FormArray;
  }

  addLandmark() {
    this.nearbyLandmarks.push(this.fb.control(''));
  }

  addApprover() {
    this.approvedBy.push(this.fb.control(''));
  }

  addAccessibility() {
    this.accessibility.push(this.fb.control(''));
  }

  addImage() {
    this.images.push(this.fb.control(''));
  }

  submit() {
    let approredby: string[] = (
      document.getElementById('approvedBy') as HTMLInputElement
    ).value.split(',') as string[];
    this.approvedBy.push(this.fb.control(approredby));
    if (this.propertyForm.valid) {
      const formData = new FormData();
      const media = this.propertyForm.get('media')?.value;

      // single thumbnail
      formData.append('thumbnail', media.thumbnail);

      // multiple images
      media.images.forEach((img: File) => {
        formData.append('images', img);
      });
      const propertyCopy = { ...this.propertyForm.value };
      delete propertyCopy.media.thumbnail;
      delete propertyCopy.media.images;
      // rest of form as JSON blob
      formData.append('property', JSON.stringify(this.propertyForm.value));
      console.log('Form Data to be sent:', formData);
      // ─── Send to backend ───
      this.propertyService.uploadProperty(formData).subscribe(
        (res) => {
          console.log('Saved successfully', res);
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
