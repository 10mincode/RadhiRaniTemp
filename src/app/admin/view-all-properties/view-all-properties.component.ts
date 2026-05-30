import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Property } from 'src/app/objects/property.model';
import { Router } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { AppComponent } from 'src/app/app.component';
import { Locality } from 'src/app/objects/locality.model';
import { LocalityService } from 'src/app/services/locality.service';
import { ToastComponent } from 'src/app/toast/toast.component';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-view-all-properties',
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
  templateUrl: './view-all-properties.component.html',
  styleUrl: './view-all-properties.component.css',
})
export class ViewAllPropertiesComponent {
  latestContacts: Array<Property> = [];

  filteredContacts = [...this.latestContacts];
  showContacts = [...this.latestContacts].slice(0, 5);

  allLocalities: Locality[] = [];
  filteredLocalities: Locality[] = [...this.allLocalities];
  showLocalities: Locality[] = [...this.filteredLocalities].slice(0, 5);

  range: { start: Date | null; end: Date | null } = { start: null, end: null };
  search_term: string = '';
  search_term_localities: string = '';
  pages: number = 0;
  current_page: number = 1;
  api_url_point = AppComponent.apiLink + '/uploads/';
  constructor(
    private snackBar: MatSnackBar,
    public router: Router,
    private propertyService: ProjectsService,
    private localityService: LocalityService,
    private toast: ToastService
  ) { }
  ngOnInit() {
    this.propertyService.getProjectsAdmin().subscribe((data) => {
      (data as Property[]).forEach((prop) => {
        prop.media.thumbnail = `${this.api_url_point}${prop.media.thumbnail}`;
        prop.media.images.forEach((img, index) => {
          prop.media.images[index] = `${this.api_url_point}${img}`;
        });
      });
      this.latestContacts = data;
      this.filteredContacts = [...this.latestContacts];
      this.updatePages();
      this.updatePage(1);
    });
    this.localityService.getLocalities().subscribe((localities) => {
      this.allLocalities = localities;
      this.filteredLocalities = [...this.allLocalities];
      this.updatePagesLocality();
      this.updatePageLocality(1);
    });
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
  applyFiltersLocalities() {
    const term = this.search_term_localities.toLowerCase();
    this.filteredLocalities = this.allLocalities.filter(
      (locality) =>
        locality.locality.toLowerCase().includes(term) ||
        locality.city.toLowerCase().includes(term) ||
        locality.state.toLowerCase().includes(term) ||
        locality.id.toLowerCase().includes(term)
    );
  }
  deleteLocality(localityId: string) {
    this.snackBar
      .open(`Deleted locality ${localityId}`, 'Undo', {
        duration: 5000,
      })
      .afterDismissed()
      .subscribe((_) => {
        if (!_.dismissedByAction) {
          this.localityService.deleteLocality(localityId).subscribe((data) => {
            this.toast.show(`Locality ${localityId} deleted successfully`, 'success', 3000);
            const currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
            return console.log(data);
          });


        }
      });
  }
  updatePageLocality(n: number) {
    this.current_page = n;

    if (n < 1 || n > this.pages) {
      this.showLocalities = [];
      return;
    }
    this.showLocalities = [...this.filteredLocalities].slice(6 * (n - 1), 6 * n);
  }
  updatePagesLocality() {
    this.pages = Math.ceil(this.filteredLocalities.length / 6);
  }
  deleteProperty(propertyId: string) {
    this.snackBar
      .open(`Deleted property ${propertyId}`, 'Undo', {
        duration: 5000,
      })
      .afterDismissed()
      .subscribe((_) => {
        if (!_.dismissedByAction) {
          this.propertyService.deleteProperty(propertyId).subscribe((data) => {
            return console.log(data);
          });
          this.snackBar
            .open(`Deletion of Property ${propertyId}: CONFIRMED`, 'OK', {
              duration: 2000,
            })
            .afterDismissed()
            .subscribe(() => {
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => {
                  this.router.navigate([this.router.url]);
                });
            });
        }
      });
  }
  toggleFeatured(propertyId: string, isFeatured: boolean) {
    this.propertyService.toggleFeatured(propertyId, isFeatured).subscribe((updatedProperty) => {
      this.toast.show(`Property ${updatedProperty.propertyName} is now ${updatedProperty.isFeatured ? 'featured' : 'unfeatured'}.`, `${updatedProperty.isFeatured ? 'success' : 'info'}`, 3000);
      this.ngOnInit(); // Refresh the list to reflect changes
    });
  }
  toggleVisibility(propertyId: string, isVisible: boolean) {
    this.propertyService.toggleVisibility(propertyId, isVisible).subscribe((updatedProperty) => {
      this.toast.show(`Property ${updatedProperty.propertyName} is now ${updatedProperty.isVisible ? 'visible' : 'invisible'}.`, `${updatedProperty.isVisible ? 'success' : 'info'}`, 3000);
      this.ngOnInit(); // Refresh the list to reflect changes
    });
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
