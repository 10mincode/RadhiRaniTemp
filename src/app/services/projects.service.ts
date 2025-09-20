import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../objects/property.model'; // jo class banayi thi
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private jsonUrl = 'assets/projects.json';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Property[]> {
    return this.http.get<Property[]>(this.jsonUrl);
  }
  getPropertyById(id: string): Observable<Property | undefined> {
    return this.getProjects().pipe(
      map(properties => properties.find(p => p.PropertyID === id))
    );
  }
}
