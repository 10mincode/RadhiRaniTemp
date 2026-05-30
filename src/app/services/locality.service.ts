import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Locality, StateCityLocality } from '../objects/locality.model';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalityService {

  constructor(private http: HttpClient) { }

  getLocalities(): Observable<Locality[]> {
    return this.http.get<Locality[]>(`${AppComponent.apiLink}/location/all`);
  }
  getStateCityLocalityArray(): Observable<StateCityLocality[]> {
    return this.getLocalities().pipe(
      map(localities => {
        const stateMap = new Map<string, Map<string, string[]>>();
        for (const entry of localities) {
          if (!stateMap.has(entry.state)) stateMap.set(entry.state, new Map());
          const cityMap = stateMap.get(entry.state)!;
          if (!cityMap.has(entry.city)) cityMap.set(entry.city, []);
          cityMap.get(entry.city)!.push(entry.locality);
        }

        return Array.from(stateMap.entries()).map(([state, cityMap]) => ({
          state,
          cities: Array.from(cityMap.entries()).map(([city, localities]) => ({
            city,
            localities
          }))
        }));
      })
    );
  }
  deleteLocality(localityId: string): Observable<any> {
    return this.http.delete(`${AppComponent.apiLink}/location/remove/${localityId}`);
  }
}
