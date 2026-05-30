import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toastState$ = this.toastSubject.asObservable();

  show(message: string = 'Something Went Wrong', type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    const id = Date.now();
    this.toastSubject.next({ id, message, type, duration });
  }
}
