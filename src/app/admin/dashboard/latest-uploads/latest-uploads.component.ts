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
  @Input() latestContacts: Array<Property> = [
    {
      propertyId: 'PROP464679',
      propertyName: 'House',
      location: {
        address: '133, Vaikunt Dham',
        city: 'MATHURA',
        state: 'Uttar Pradesh',
        postalCode: '281001',
        latitude: 0,
        longitude: 0,
        nearbyLandmarks: ['Sarawati vidya madir (5 km)'],
      },
      description: 'propertypropertypropertypropertypropertyproperty',
      propertyType: 'Apartment',
      status: 'Under Construction',
      dateListed: '2025-09-23',
      dateUpdated: '',
      actualPrice: 46532645,
      showcasePrice: '645456',
      pricePerSqFt: 451,
      minBookingAmount: 0,
      furnishing: 'Semi-Furnished',
      facing: 'South',
      propertyAge: '25',
      legalClearances: {
        reraId: '55746367436',
        approvedBy: ['KDA', 'MTR', 'RERA', 'ETC'],
      },
      features: {
        bedrooms: 5,
        bathrooms: 5,
        areaSqFt: 5000,
        floor: '2',
        totalFloors: 5,
        yearBuilt: 2000,
        amenities: {
          parks: true,
          garden: true,
          swimmingPool: false,
          gym: true,
          security: true,
          parking: false,
          playArea: false,
          clubHouse: false,
          shoppingCenter: true,
          publicTransport: true,
          cCRoads: false,
          powerBackup: false,
          waterSupply: true,
          wideSewage: false,
          rainWaterHarvesting: true,
          fireSafety: true,
          smartHome: false,
          petFriendly: false,
          movieHall: false,
          accessibility: ['ramp', 'stairs'],
        },
      },
      media: {
        thumbnail: '1758654226827-199263319.jpg',
        images: [
          '1758654226830-161721311.png',
          '1758654226830-338684475.jpeg',
          '1758654226831-712843631.jpeg',
          '1758654226831-910703783.jpeg',
          '1758654226835-638494728.jpg',
          '1758654226839-306768896.jpg',
          '1758654226841-921729925.png',
          '1758654227228-951746266.png',
        ],
      },
    },
    {
      propertyId: 'PROP112458',
      propertyName: 'Nilay Prime Plots',
      location: {
        address: 'Kunhari',
        city: 'Kota',
        state: 'Rajasthan',
        postalCode: '324006',
        latitude: 25,
        longitude: 70,
        nearbyLandmarks: ['Sarawati vidya madir (2 km)', 'Hotel (0.6 km)'],
      },
      description:
        'Best Locations for Residential & Commercial Properties\nThe most desirable locations for both residential and commercial properties on 90ft, 60ft, and 30ft CC roads are those with high visibility and accessibility. For both types of properties, corner plots are particularly valuable.\n\nOn 90ft Roads 🛣️\nResidential: These roads are ideal for high-end residential properties, including luxury villas and multi-story apartments. The wider road allows for grand entrances and provides a sense of open space. The best locations are often near green spaces or away from heavy commercial traffic.\n\nCommercial: A 90ft road is prime for large-scale commercial establishments like shopping malls, corporate offices, and showrooms. The high traffic flow ensures maximum exposure, and the wide road makes for easy customer access and ample parking.\n\nOn 60ft Roads 🏙️\nResidential: These roads are excellent for a mix of mid-to-high-end residential properties, including duplexes and housing societies. They offer a good balance of accessibility and a quieter environment compared to 90ft roads.\n\nCommercial: 60ft roads are well-suited for neighborhood commercial hubs. Think of banks, restaurants, clinics, and smaller retail shops. They offer good visibility without the overwhelming traffic of a 90ft road.\n\nOn 30ft CC Roads 🏘️\nResidential: These roads are the most common for standard residential homes, including independent houses and small apartments. They provide a peaceful, community-oriented atmosphere and are generally less expensive. The best locations are those within a planned residential sector, offering a sense of security and a quiet neighborhood feel.\n\nCommercial: Commercial use on these roads is typically limited to small businesses serving the local community. Examples include convenience stores, salons, laundromats, and small workshops. They benefit from a captive local customer base.',
      propertyType: 'Plots',
      status: 'New Launch',
      dateListed: '2025-09-24T17:02:33.862Z',
      dateUpdated: '2025-09-24T17:02:33.862Z',
      actualPrice: 2500000,
      showcasePrice: '2700000',
      pricePerSqFt: 2500,
      minBookingAmount: 0,
      furnishing: 'Unfurnished',
      facing: 'East',
      propertyAge: '0',
      legalClearances: {
        reraId: 'RERA/2025/007',
        approvedBy: ['KDA', 'MTR', 'RERA', 'ETC'],
      },
      features: {
        bedrooms: 0,
        bathrooms: 0,
        areaSqFt: 1000,
        floor: '0',
        totalFloors: 0,
        yearBuilt: 2025,
        amenities: {
          parks: true,
          garden: true,
          swimmingPool: true,
          gym: false,
          security: false,
          parking: true,
          playArea: true,
          clubHouse: false,
          shoppingCenter: true,
          publicTransport: false,
          cCRoads: true,
          powerBackup: true,
          waterSupply: true,
          wideSewage: true,
          rainWaterHarvesting: false,
          fireSafety: false,
          smartHome: false,
          petFriendly: false,
          movieHall: false,
          accessibility: [],
        },
      },
      media: {
        thumbnail: '1758733353510-881423824.jpg',
        images: [
          '1758733353522-159018081.jpg',
          '1758733353526-230093235.jpg',
          '1758733353845-698117808.jpg',
          '1758733353845-563314688.jpg',
          '1758733353846-189583072.jpg',
          '1758733353848-329998250.jpg',
        ],
      },
    },
    {
      propertyId: 'PROP417527',
      propertyName: 'South X Township',
      location: {
        address: 'Raipura Kaithon Road',
        city: 'Kota',
        state: 'Rajasthan',
        postalCode: '324006',
        latitude: 25,
        longitude: 77,
        nearbyLandmarks: ['Near Kota Club (0.1 km)'],
      },
      description:
        'Located in the vibrant city of Kota, South X Township by Coral Colonizers is a residential project designed for a modern, comfortable lifestyle. This under-construction development in Raipura, Kota, offers a collection of 3 BHK villas spread across a 4.92-acre area. South X provides a serene and well-equipped living environment with a range of amenities to cater to the needs of its residents.\n\nThe township is designed with a focus on community living and includes features like a garden, jogging track, and a gym for health and wellness. Essential services such as 24/7 water supply, power backup, and dedicated car parking ensure a hassle-free experience. The project emphasizes security with CCTV surveillance and a gated community. With a RERA ID of RAJ/P/2024/3335, South X offers a secure investment opportunity with a promised possession date in early 2026. Its strategic location and well-planned infrastructure make it an attractive option for those seeking a premium living experience in Kota',
      propertyType: 'Villa',
      status: 'Ready to Move',
      dateListed: '2025-09-24T17:22:54.606Z',
      dateUpdated: '2025-09-24T17:22:54.606Z',
      actualPrice: 6500000,
      showcasePrice: '7000000',
      pricePerSqFt: 5500,
      minBookingAmount: 0,
      furnishing: 'Furnished',
      facing: 'East',
      propertyAge: '0',
      legalClearances: {
        reraId: 'RAJ/P/2024/3335',
        approvedBy: ['KDA', 'MTR', 'RERA', 'ETC'],
      },
      features: {
        bedrooms: 3,
        bathrooms: 3,
        areaSqFt: 1250,
        floor: '0',
        totalFloors: 2,
        yearBuilt: 2025,
        amenities: {
          parks: true,
          garden: true,
          swimmingPool: false,
          gym: true,
          security: true,
          parking: true,
          playArea: false,
          clubHouse: false,
          shoppingCenter: true,
          publicTransport: true,
          cCRoads: true,
          powerBackup: true,
          waterSupply: true,
          wideSewage: true,
          rainWaterHarvesting: true,
          fireSafety: true,
          smartHome: false,
          petFriendly: false,
          movieHall: false,
          accessibility: ['stairs'],
        },
      },
      media: {
        thumbnail: '1758734574230-758844363.jpg',
        images: [
          '1758734574242-668624772.jpg',
          '1758734574253-332132606.jpg',
          '1758734574571-850730199.jpg',
          '1758734574574-137577139.jpg',
          '1758734574577-795827769.jpg',
          '1758734574579-939091813.jpg',
          '1758734574593-746609988.jpg',
          '1758734574595-856827447.jpg',
          '1758734574597-147558720.jpg',
          '1758734574598-177837709.jpg',
          '1758734574601-920580851.jpg',
        ],
      },
    },
  ];

  filteredContacts = [...this.latestContacts];
  showContacts = [...this.latestContacts].slice(0, 5);
  range: { start: Date | null; end: Date | null } = { start: null, end: null };
  search_term: string = '';
  pages: number = 0;
  current_page: number = 1;

  constructor(private snackBar: MatSnackBar, public router: Router) {}
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
        property.actualPrice.toString().toLowerCase().includes(term)
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
