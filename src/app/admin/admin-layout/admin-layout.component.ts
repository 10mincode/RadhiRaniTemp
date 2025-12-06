import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MetricsCardComponent } from '../dashboard/metrics-card/metrics-card.component';

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
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLElement>;
  @ViewChild('adminHeader') adminHeader!: ElementRef<HTMLElement>;
  loginForm = this.fb.group({
    username: [''],
    password: [''],
  });
  constructor(private fb: FormBuilder, private router: Router) {
    const admin = localStorage.getItem('admin');
    if (admin && admin != 'None') {
      this.proceed = true;
    }
  }
  ngOnInit() {
    if (this.router.url !== '/admin') {
      this.formErrors = [];
      this.formErrors.push(
        'Access Denied! Please login as admin to access this page.'
      );
    } else if (this.proceed) {
      this.router.navigate(['/admin/dashboard']);
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
  }
  logOut() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.setItem('admin', 'None');
      this.proceed = false;
      this.router.navigate(['/admin']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      // Replace with your actual admin credentials
      alert(`Logged in successfully as ${username}`);
      if (username == 'admin' && password == 'admin@123') {
        localStorage.setItem('admin', username);
        this.proceed = true;
        this.router.navigate([
          `${this.router.url == 'admin' || '/admin/dashboard'}`,
        ]);
      }
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
}
