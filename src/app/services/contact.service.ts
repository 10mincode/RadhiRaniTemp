import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { Contact } from '../objects/contact.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private http: HttpClient) {}
  link = AppComponent.apiLink;

  sendContactForm(formData: any) {
    return this.http.post(`${this.link}/contacts`, formData);
  }
  updateContactFormStatus(
    id: string,
    status: 'Pending' | 'Active' | 'Resolved'
  ) {
    return this.http.patch(`${this.link}/contacts/${id}`, { status: status });
  }
  getContactMessages(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.link}/contacts`);
  }
  getContactMessagesByPropertyId(id: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.link}/contacts/prop/${id}`);
  }
}
