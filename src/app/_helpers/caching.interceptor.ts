import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheMapService } from '../_services/cache/cache-map.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    constructor(private cache: CacheMapService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
         let bypassCache = false;
         if(req.headers.get('reset')) {
            bypassCache = true;
         }
         
         const headers = req.headers.delete('reset');
         req = req.clone({ headers: headers})

        if (!this.isRequestCachable(req)) { 
           return next.handle(req); 
        }
        const cachedResponse = this.cache.get(req);

        if (cachedResponse !== null && !bypassCache) {
           return of(cachedResponse);
        }

        return next.handle(req).pipe(
           tap(event => {
              if (event instanceof HttpResponse) {
                this.cache.put(req, event); 
              }
           })
        );
    }
    private isRequestCachable(req: HttpRequest<any>) {
        return req.method === 'GET';
    }
} 