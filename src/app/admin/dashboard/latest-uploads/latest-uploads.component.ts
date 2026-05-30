import { CommonModule, DatePipe, formatDate } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Property } from 'src/app/objects/property.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-latest-uploads',
  imports: [
    DatePipe,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './latest-uploads.component.html',
  styleUrl: './latest-uploads.component.css',
})
export class LatestUploadsComponent {
  @Input() latestContacts: Array<Property> = [];

  filteredContacts = [...this.latestContacts];
  showContacts = [...this.latestContacts].slice(0, 5);
  range: { start: Date | null; end: Date | null } = { start: null, end: null };
  search_term: string = '';
  pages: number = 0;
  current_page: number = 1;

  constructor(private snackBar: MatSnackBar, public router: Router) { }
  ngOnInit() {
    this.updatePages();

    this.updatePage(1);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['latestContacts'] && this.latestContacts.length > 0) {
      console.log('Latest contacts updated:', this.latestContacts);
      this.filteredContacts = [...this.latestContacts];
      this.showContacts = [...this.filteredContacts].slice(0, 5);
    }
  }
  get startEntry(): number {
    if (this.current_page == 0) return 0;
    return 6 * (this.current_page - 1) + 1;
  }

  get endEntry(): number {
    const end = 6 * this.current_page;
    return end <= this.filteredContacts.length
      ? end
      : this.filteredContacts.length;
  }
  updatePage(n: number) {
    this.current_page = n;

    if (n < 1 || n > this.pages) {
      this.showContacts = [];
      this.current_page = 0;
      return;
    }
    this.showContacts = [...this.filteredContacts].slice(6 * (n - 1), 6 * n);
  }
  updatePages() {
    this.pages = Math.ceil(this.filteredContacts.length / 6);
  }
  applySearchFilters() {
    const term = this.search_term.toLowerCase();
    this.filteredContacts = this.filteredContacts.filter(
      (property) =>
        property.propertyName.toLowerCase().includes(term) ||
        property.location.city.toLowerCase().includes(term) ||
        property.location.state.toLowerCase().includes(term) ||
        property.propertyId.toLowerCase().includes(term) ||
        property.startingPrice.toString().toLowerCase().includes(term)
    );
  }
  applyDateFilters() {
    const start = this.range.start
      ? formatDate(new Date(this.range.start), 'yyyy-MM-dd', 'en-in')
      : null;
    const end = this.range.end
      ? formatDate(new Date(this.range.end), 'yyyy-MM-dd', 'en-in')
      : null;
    this.filteredContacts = this.latestContacts.filter((property) => {
      const uploadDate = formatDate(
        new Date(property.dateListed),
        'yyyy-MM-dd',
        'en-in'
      );
      const afterStart = start ? uploadDate >= start : true;
      const beforeEnd = end ? uploadDate <= end : true;
      return afterStart && beforeEnd;
    });
  }

  applyFilters() {
    if (this.range.start != null || this.range.end != null) {
      this.applyDateFilters();
    } else {
      this.filteredContacts = [...this.latestContacts];
    }
    this.applySearchFilters();

    this.updatePages();
    if (!this.pages) this.updatePage(0);
    else this.updatePage(1);
  }

  //TODO: to change this for property
  //   exportToCSV(type: 'all' | 'filtered') {
  //     console.log('Export triggered');
  //     const headers = ['Name', 'Email', 'Date'];
  //     const rows =
  //       type === 'filtered'
  //         ? this.filteredContacts.map((contact) => [
  //             contact.name,
  //             contact.email,
  //             new Date(contact.date).toLocaleDateString(),
  //           ])
  //         : this.latestContacts.map((contact) => [
  //             contact.name,
  //             contact.email,
  //             new Date(contact.date).toLocaleDateString(),
  //           ]);
  //     const csvContent = [headers, ...rows]
  //       .map((e) =>
  //         e.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',')
  //       )
  //       .join('\n');
  //
  //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //     saveAs(blob, `contacts_export_${type}.csv`);
  //     this.snackBar.open(`Exported ${type} contacts`, 'Close', {
  //       duration: 3000,
  //     });
  //   }
}
