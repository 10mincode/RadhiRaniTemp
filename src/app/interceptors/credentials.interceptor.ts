import { HttpInterceptor, HttpHandler } from "@angular/common/http";
import { HttpRequest } from "@angular/common/module.d-CnjH8Dlt";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const cloned = req.clone({ withCredentials: true });
        return next.handle(cloned).pipe(catchError((err) => {
            if (err.status === 401) {
                // Token expired — clear local data and redirect
                localStorage.removeItem('adminRole');
                localStorage.removeItem('adminName');
                this.router.navigate(['/admin']);
            }
            return throwError(() => err);
        }));
    }
}