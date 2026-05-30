import { Component, OnInit } from '@angular/core';
import { Property } from '../objects/property.model';
import { ProjectsService } from '../services/projects.service';
import { LocalityService } from '../services/locality.service';
import { Locality, StateCityLocality } from '../objects/locality.model';
import { AppComponent } from '../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, PRECONNECT_CHECK_BLOCKLIST } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { PriceUnit } from '../objects/priceUnit.constant';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class PropertiesComponent implements OnInit {
  allProperties: Property[] = [];
  filteredProperties: Property[] = [];
  api_url_point = `${AppComponent.apiLink}/uploads/`;

  // Filters
  searchQuery = '';
  selectedType = '';
  selectedState = '';
  selectedCity = '';
  selectedLocality = '';

  // Location data
  statecity: StateCityLocality[] = [];
  citiesList: { city: string; localities: string[] }[] = [];
  localitiesList: string[] = [];
  allLocalities: Locality[] = [];
  propertyTypes = ['Villa', 'Plots Township', 'Farm House', 'Modern Apartment'];

  constructor(
    private propertyService: ProjectsService,
    private localityService: LocalityService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    forkJoin({
      properties: this.propertyService.getProjects(),
      localities: this.localityService.getStateCityLocalityArray(),
      allLocalities: this.localityService.getLocalities()
    }).subscribe(({ properties, localities, allLocalities }) => {

      this.allProperties = properties.map(p => {
        p.media.thumbnail = `${this.api_url_point}${p.media.thumbnail}`;
        return p;
      });
      this.statecity = localities;
      this.allLocalities = allLocalities;

      // Now read query params and apply
      const params = this.route.snapshot.queryParams;

      if (params['type']) this.selectedType = params['type'];
      if (params['state']) {
        this.selectedState = params['state'];
        const stateObj = this.statecity.find(s => s.state === this.selectedState);
        this.citiesList = stateObj ? stateObj.cities : [];
      }
      if (params['city']) {
        this.selectedCity = params['city'];
        const cityObj = this.citiesList.find(c => c.city === this.selectedCity);
        this.localitiesList = cityObj ? cityObj.localities : [];
      }
      if (params['locality']) {
        this.selectedLocality = params['locality'];
        setTimeout(() => {
          this.onMSClicked(this.selectedLocality);
        }, 0);
      }
      if (params['search']) this.searchQuery = params['search'];

      this.applyFilters();

    });
  }

  onStateChange(event: any) {
    this.selectedState = event.target.value;
    this.selectedCity = '';
    this.selectedLocality = '';
    const stateObj = this.statecity.find(s => s.state === this.selectedState);
    this.citiesList = stateObj ? stateObj.cities : [];
    this.localitiesList = [];
    this.onMSClicked('');
    this.applyFilters();
  }

  onCityChange(event: any) {
    this.selectedCity = event.target.value;
    this.selectedLocality = '';
    const cityObj = this.citiesList.find(c => c.city === this.selectedCity);
    this.localitiesList = cityObj ? cityObj.localities : [];
    this.onMSClicked('');
    this.applyFilters();
  }

  onLocalityChange(event: any) {
    this.selectedLocality = event.target.value;
    this.applyFilters();
  }

  onTypeChange(event: any) {
    this.selectedType = event.target.value;
    this.applyFilters();
  }

  onMSClicked(event: string | any) {
    if (event === '') {
      this.selectedLocality = '';
      document.querySelectorAll('.most-searched-btn').forEach(btn => {
        btn.classList.remove('active');
      });
    }
    else {
      let selectedObj, btn;
      if (typeof event === 'string') {
        selectedObj = this.allLocalities.find(loc => loc.locality === event);
        btn = document.getElementById(event);
      } else {
        selectedObj = this.allLocalities.find(loc => loc.locality === event.target.id);
        btn = event.target;
      }
      if (btn!.classList.contains('active')) {
        this.selectedState = '';
        this.selectedCity = '';
        this.selectedLocality = '';
        btn!.classList.remove('active');
      } else {
        console.log('Selected locality object:', selectedObj);
        this.selectedState = selectedObj ? selectedObj.state : '';
        this.filteredProperties = [...this.allProperties];

        const stateObj = this.statecity.find(s => s.state === selectedObj?.state);
        this.citiesList = stateObj ? stateObj.cities : [];
        const cityObj = this.citiesList.find(c => c.city === selectedObj?.city);
        console.log('Derived cities list:', cityObj);
        this.localitiesList = cityObj ? cityObj.localities : [];
        this.selectedCity = selectedObj ? selectedObj.city : '';
        this.selectedLocality = selectedObj ? selectedObj.locality : '';
        btn!.classList.toggle('active');
        document.querySelectorAll('.most-searched-btn').forEach(btn_ => {
          if (btn_ !== btn) btn_.classList.remove('active');
        });
      }

    }
    this.applyFilters();
  }
  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: this.selectedType || null,
        state: this.selectedState || null,
        city: this.selectedCity || null,
        locality: this.selectedLocality || null,
        search: this.searchQuery || null
      },
      queryParamsHandling: 'merge'
    });

    this.filteredProperties = this.allProperties.filter(p => {
      const matchesType = this.selectedType
        ? p.propertyType?.toLowerCase() === this.selectedType.toLowerCase()
        : true;

      const matchesState = this.selectedState
        ? p.location?.state === this.selectedState
        : true;

      const matchesCity = this.selectedCity
        ? p.location?.city === this.selectedCity
        : true;

      const matchesLocality = this.selectedLocality
        ? p.location?.locality === this.selectedLocality
        : true;

      const matchesSearch = this.searchQuery
        ? p.propertyName?.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;

      return matchesType && matchesState && matchesCity && matchesLocality && matchesSearch;
    });
  }

  getPriceUnit(priceUnit: string) {
    return PriceUnit[priceUnit as keyof typeof PriceUnit] || priceUnit;
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedState = '';
    this.selectedCity = '';
    this.selectedLocality = '';
    this.citiesList = [];
    this.localitiesList = [];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
    this.filteredProperties = [...this.allProperties];
  }

  viewProperty(id: string) {
    this.router.navigate(['/property', id]);
  }
}