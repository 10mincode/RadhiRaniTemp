import { AppComponent } from './../app.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../objects/property.model'; // jo class banayi thi
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private jsonUrl = 'assets/projects.json';

  constructor(private http: HttpClient) { }

  // getProjects(): Observable<Property[]> {
  //   return this.http.get<Property[]>(this.jsonUrl);
  // }
  // getProjectById(id: string): Observable<Property | undefined> {
  //   return this.getProjects().pipe(
  //     map((properties) => properties.find((p) => p.PropertyID === id))
  //   );
  // }
  getProjects(): Observable<Property[]> {
    return this.http.get<Property[]>(`${AppComponent.apiLink}/properties/`);

    // return this.http.get<Property[]>(this.jsonUrl);
  }
  getProjectsAdmin(): Observable<Property[]> {
    return this.http.get<Property[]>(`${AppComponent.apiLink}/properties/admin`);

    // return this.http.get<Property[]>(this.jsonUrl);
  }
  getProjectById(id: string): Observable<Property | undefined> {
    return this.http.get<Property>(`${AppComponent.apiLink}/properties/${id}`);
  }
  uploadProperty(formData: any): Observable<Property> {
    return this.http.post<Property>(
      `${AppComponent.apiLink}/properties/upload`,
      formData
    );
  }
  updateProperty(id: string, formData: any) {
    return this.http.put(`${AppComponent.apiLink}/properties/update/${id}`, formData);
  }
  deleteProperty(id: string): Observable<any> {
    return this.http.delete(`${AppComponent.apiLink}/properties/${id}`);
  }
  recordView(propertyId: string): Observable<any> {
    return this.http.post(`${AppComponent.apiLink}/property-view/${propertyId}/view`, {});
  }

  getViewStats(propertyId: string): Observable<any> {
    return this.http.get(`${AppComponent.apiLink}/property-view/stats/${propertyId}`);
  }
  getTotalStats(): Observable<any> {
    return this.http.get(`${AppComponent.apiLink}/property-view/stats/all`);
  }
  toggleFeatured(id: string, isFeatured: boolean): Observable<Property> {
    return this.http.put<Property>(`${AppComponent.apiLink}/properties/${id}/feature`, { isFeatured: !isFeatured });
  }
  toggleVisibility(id: string, isVisible: boolean): Observable<Property> {
    return this.http.put<Property>(`${AppComponent.apiLink}/properties/${id}/visibility`, { isVisible: !isVisible });
  }
}
