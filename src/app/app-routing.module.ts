import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UploadPropertyComponent } from './upload-property/upload-property.component';
import { PropertyPageComponent } from './property-page/property-page.component';

const routes: Routes = [
  { component: HomePageComponent, path: "" },
  { component: HomePageComponent, path: "" },
  { component: HomePageComponent, path: "home" },
  { path: 'property/:id', component: PropertyPageComponent },
  { component: UploadPropertyComponent, path: "upload" },
  { component: NotFoundComponent, path: "**" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
