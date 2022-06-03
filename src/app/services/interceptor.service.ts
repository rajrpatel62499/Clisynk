import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpService} from './http.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

    constructor(
        private http: HttpService,
        private toastr: ToastrService,
        public router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem('accessToken');
        if (token) {
            req = req.clone({headers: req.headers.set('authorization', 'Bearer ' + token)});
        } else {
            req = req.clone({headers: req.headers.set('authorization', 'Bearer ')});
        }

        if (req.reportProgress === true) {
            this.http.loaderOn(true);
        }

        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.http.loaderOn(false);
                }
            },
            (err: any) => {
                this.http.loaderOn(false);
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        localStorage.removeItem('accessToken');
                        this.router.navigate(['/login']);
                    } else {
                        this.toastr.error(err.error.message || 'Something went wrong', 'OOPS!');
                    }
                }
            }));
    }
}
