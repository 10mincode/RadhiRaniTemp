import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../../app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-locality',
  templateUrl: './add-locality.component.html',
  styleUrls: ['./add-locality.component.css'],
  imports: [FormsModule, CommonModule]
})
export class AddLocalityComponent {
  @Output() close = new EventEmitter<void>();
  @Output() localityAdded = new EventEmitter<void>();
  @Input() isModal = false;
  state = '';
  city = '';
  locality = '';
  loading = false;
  success = false;
  error = '';

  constructor(private http: HttpClient, private router: Router

  ) { }

  submit() {
    if (!this.state || !this.city || !this.locality) {
      this.error = 'All fields are required';
      return;
    }
    this.loading = true;
    this.error = '';
    this.http.post(`${AppComponent.apiLink}/location/add`, {
      state: this.state,
      city: this.city,
      locality: this.locality
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.localityAdded.emit();
        setTimeout(() => {
          this.success = false;
          this.state = '';
          this.city = '';
          this.locality = '';
        }, 1500);
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to add locality. Try again.';
      }
    });
  }

  dismiss() {
    if (this.isModal) this.close.emit();
    else {
      this.router.navigate(['/admin/viewall']);
    }
  }
}