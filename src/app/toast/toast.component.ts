import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { ToastMessage, ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  standalone: false,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(200px)' }),
        animate('1000ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('1000ms ease-in', style({ opacity: 0, transform: 'translateX(50px)' }))
      ])
    ])
  ]
})

export class ToastComponent {
  private toastService = inject(ToastService);
  toasts: ToastMessage[] = [];

  ngOnInit() {
    this.toastService.toastState$.subscribe((toast) => {
      this.toasts.push(toast);

      // Auto-dismiss based on duration
      setTimeout(() => {
        this.dismiss(toast.id);
      }, toast.duration || 3000);
    });
  }

  dismiss(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
