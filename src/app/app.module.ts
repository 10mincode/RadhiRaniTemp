import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormsModule } from '@angular/forms';
import { PropertyPageComponent } from './property-page/property-page.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LatestContactsComponent } from './admin/dashboard/latest-contacts/latest-contacts.component';

@NgModule({
  declarations: [
    AppComponent,
    PropertyCardComponent,
    NotFoundComponent,
    PropertyPageComponent,
  ],

  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    DecimalPipe,
    LatestContactsComponent,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
