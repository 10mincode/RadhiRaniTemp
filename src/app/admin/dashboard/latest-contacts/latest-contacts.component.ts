import { CommonModule, DatePipe, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ContactService } from 'src/app/services/contact.service';
import { Contact } from 'src/app/objects/contact.model';
//Export Dialog
@Component({
  selector: 'exportdialog',
  templateUrl: 'exportdialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportDialog {}

//Contact Detail Dialog
@Component({
  selector: 'contact-detail-dialog',
  templateUrl: 'contact_detailed.html',
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,

    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactDetailDialog {
  constructor(
    private contactService: ContactService,
    private dialogRef: MatDialogRef<ContactDetailDialog>,
    private snackBar: MatSnackBar
  ) {}
  data = inject(MAT_DIALOG_DATA);
  contact = this.data.contact;
  proposedStatus: 'Pending' | 'Active' | 'Resolved' | '' = '';
  ngOnInit() {
    this.proposedStatus = this.contact.status;
  }
  openMail(contact: any) {
    let subject = `Response to your enquiry on RadhaRani Homes on ${new Date(
      contact.createdAt
    ).toLocaleDateString()}`;
    let message = `Replying to your message: "${contact.message}"\n\n`;
    const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    window.open(mailto, '_top');
    this.snackBar.open(`Opening mail client for ${contact.email}`, 'Close', {
      duration: 3000,
    });
  }
  changeStatus() {
    if (
      this.proposedStatus !== this.contact.status &&
      this.proposedStatus !== ''
    ) {
      const confirmed = confirm(
        `Are you sure you want to mark this as ${this.proposedStatus}?`
      );
      if (!confirmed) {
        this.dialogRef.close(true);
        return;
      }
      this.contactService
        .updateContactFormStatus(this.contact.id, this.proposedStatus)
        .subscribe(() => {
          this.snackBar.open(`Status updated to ${this.proposedStatus}`, '', {
            duration: 2000,
          });
          this.contact.status = this.proposedStatus;
          this.dialogRef.close(true); // ✅ manually close after action
        });
    } else {
      this.dialogRef.close(true); // ✅ close even if no change
    }
  }
  getColorbyStatus(status: string = this.contact.status) {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Active':
        return 'status-active';
      case 'Resolved':
        return 'status-resolved';
      default:
        return '';
    }
  }
}
@Component({
  selector: 'app-latest-contacts',
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
  templateUrl: './latest-contacts.component.html',
  styleUrl: './latest-contacts.component.css',
})
export class LatestContactsComponent {
  @Input() propertyId: string | null = null;
  latestContacts: Array<Contact> = [];

  readonly dialog = inject(MatDialog);

  filteredContacts = [...this.latestContacts];
  showContacts = [...this.latestContacts].slice(0, 5);
  range: { start: Date | null; end: Date | null } = { start: null, end: null };
  search_term: string = '';
  pages: number = 0;
  current_page: number = 0;

  constructor(
    private snackBar: MatSnackBar,
    private contactService: ContactService
  ) {}
  ngOnInit() {
    if (this.propertyId == null) {
      this.contactService.getContactMessages().subscribe((data) => {
        console.log(data);
        this.latestContacts = data;
        this.filteredContacts = [...this.latestContacts];
        this.updatePages();

        this.updatePage(1);
      });
    }
    this.updatePages();

    this.updatePage(1);
  }
  ngOnChanges(changes: SimpleChanges) {
    if ('propertyId' in changes) {
      this.contactService
        .getContactMessagesByPropertyId(this.propertyId || '')
        .subscribe((data) => {
          this.latestContacts = data;
          console.log(this.latestContacts);
          this.filteredContacts = [...this.latestContacts];
          this.updatePages();

          this.updatePage(1);
        });
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
    if (this.filteredContacts.length == 0) this.current_page = 0;
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
      (contact) =>
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.status.toLowerCase().includes(term)
    );
  }
  applyDateFilters() {
    const start = this.range.start
      ? formatDate(new Date(this.range.start), 'yyyy-MM-dd', 'en-in')
      : null;
    const end = this.range.end
      ? formatDate(new Date(this.range.end), 'yyyy-MM-dd', 'en-in')
      : null;
    this.filteredContacts = this.latestContacts.filter((contact) => {
      const uploadDate = formatDate(
        new Date(contact.createdAt),
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
  openExportDialog() {
    const dialogRef = this.dialog.open(ExportDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result == null) return;
      this.exportToCSV(result ? 'filtered' : 'all');
    });
  }
  openContactDetailDialog(contact: any) {
    const dialogRef = this.dialog.open(ContactDetailDialog, {
      data: {
        contact: contact,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  exportToCSV(type: 'all' | 'filtered') {
    console.log('Export triggered');
    const headers = ['Name', 'Email', 'Date'];
    const rows =
      type === 'filtered'
        ? this.filteredContacts.map((contact) => [
            contact.name,
            contact.email,
            new Date(contact.createdAt).toLocaleDateString(),
          ])
        : this.latestContacts.map((contact) => [
            contact.name,
            contact.email,
            new Date(contact.createdAt).toLocaleDateString(),
          ]);
    const csvContent = [headers, ...rows]
      .map((e) =>
        e.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `contacts_export_${type}.csv`);
    this.snackBar.open(`Exported ${type} contacts`, 'Close', {
      duration: 3000,
    });
  }
  openMail(contact: any) {
    let subject = `Response to your enquiry on RadhaRani Homes on ${new Date(
      contact.createdAt
    ).toLocaleDateString()}`;
    let message = `Replying to your message: "${contact.message}"\n\n`;
    const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    window.open(mailto, '_top');
    this.snackBar.open(`Opening mail client for ${contact.email}`, 'Close', {
      duration: 3000,
    });
  }
}
