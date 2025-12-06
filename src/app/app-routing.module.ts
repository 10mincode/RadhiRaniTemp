import { NgModule, ViewEncapsulation } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PropertyPageComponent } from './property-page/property-page.component';
import { PropertyPageComponent as AdminPropertyPageComponent } from './admin/property-page/property-page.component';
import { UploadPropertyComponent } from './admin/upload-property/upload-property.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ViewAllPropertiesComponent } from './admin/view-all-properties/view-all-properties.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { component: HomePageComponent, path: '' },
      { component: HomePageComponent, path: 'home' },
      { path: 'property/:id', component: PropertyPageComponent },
      // other public routes
    ],
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { component: UploadPropertyComponent, path: 'upload' },
      { component: DashboardComponent, path: 'dashboard' },
      { component: ViewAllPropertiesComponent, path: 'viewall' },
      { component: AdminPropertyPageComponent, path: 'property/:id' },
    ],
  },
  { component: NotFoundComponent, path: '**' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
