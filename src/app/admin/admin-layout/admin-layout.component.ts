import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MetricsCardComponent } from '../dashboard/metrics-card/metrics-card.component';
import { AppComponent } from 'src/app/app.component';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  encapsulation: ViewEncapsulation.None,

  selector: 'app-admin-layout',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css', '../selected-bootstrap.css'],
})
export class AdminLayoutComponent {
  proceed: boolean = false;
  formErrors: string[] = [];
  showPassword: boolean = false;
  isMenuOpen: boolean = false;
  modalOpen: boolean = false;
  loadings: boolean[] = [false, false, false, false];
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLElement>;
  @ViewChild('adminHeader') adminHeader!: ElementRef<HTMLElement>;
  loginForm = this.fb.group({
    username: [''],
    password: [''],
  });
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private toast: ToastService) {
    const role = localStorage.getItem('adminRole');
    if (role) {
      this.proceed = true;
    }
  }
  routerSub!: Subscription;

  ngOnInit() {
    this.checkRouteLogic(this.router.url);
    if (this.router.url === '/admin' && this.proceed) {
      this.router.navigateByUrl('admin/dashboard')
    }
    // Listen for subsequent navigations
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRouteLogic(event.url);
    });
  }
  checkRouteLogic(url: string) {
    const role = localStorage.getItem('adminRole');
    if (role) {
      this.proceed = true;
    } else {
      this.proceed = false;
    }

  }
  ngAfterViewInit() {
    this.wrapper.nativeElement.style.marginTop =
      this.adminHeader.nativeElement.offsetHeight + 20 + 'px';
  }
  @HostListener('window:resize', ['$event'])
  onViewPortSizeChange(event: any) {
    this.wrapper.nativeElement.style.marginTop =
      this.adminHeader.nativeElement.offsetHeight + 20 + 'px';
  } logOut() {
    if (confirm('Are you sure you want to logout?')) {
      this.http.post(`${AppComponent.apiLink}/auth/logout`, {},
        { withCredentials: true }
      ).subscribe();
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminName');
      this.proceed = false;
      this.router.navigate(['/admin']);
    }
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('LOgin starrted')
      const { username, password } = this.loginForm.value;
      this.http.post(`${AppComponent.apiLink}/auth/login`,
        { username, password },
        { withCredentials: true }
      ).subscribe({
        next: (res: any) => {
          localStorage.setItem('adminRole', res.role);
          localStorage.setItem('adminName', res.name);
          this.proceed = true;
          this.router.navigate(['/admin/dashboard']);
        },
        error: () => {
          this.formErrors = ['Invalid username or password'];
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.formErrors = [];
      for (const field in this.loginForm.controls) {
        const control = this.loginForm.get(field);
        if (control && control.invalid) {
          const errors = control.errors;
          console.log(errors);
          if (errors?.['required'])
            this.formErrors.push(`${field} is required`);
          if (errors?.['minlength'])
            this.formErrors.push(
              `${field} must be at least ${errors['minlength'].requiredLength} characters`
            );
          if (errors?.['maxlength'])
            this.formErrors.push(
              `${field} must be at most ${errors['maxlength'].requiredLength} characters`
            );
        }
      }
    }
  }
  //header functions
  logoClick() {
    this.router.navigate(['/admin/dashboard']);
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  exportData(type: number) {
    this.loadings[type] = true;
    let endpoint = '';
    if (type === 0) endpoint = 'property-view';
    else if (type === 1) endpoint = 'properties';
    else if (type === 2) endpoint = 'contacts';
    else if (type === 3) endpoint = 'location';
    this.http.get(`${AppComponent.apiLink}/${endpoint}/export`, {
      withCredentials: true,
      responseType: 'blob',
    }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${endpoint}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.loadings[type] = false;
        this.toast.show(`${endpoint} data exported successfully!`, 'success');
      },
      error: () => {
        this.loadings[type] = false;
        this.toast.show('Error exporting data', 'error');
      }
    });
  }
}
