import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class BaseService {

    protected getRequest<Response>(url: string): Observable<Response> {
        return this.http.get<Response>( url );
    }

    protected postRequest<Body, Response>(url: string, body: Body): Observable<Response> {
        return this.http.post<Response>( url, body );
    }

    protected putRequest<Body, Response>(url: string, body: Body): Observable<Response> {
        return this.http.put<Response>( url, body );
    }

    protected patchRequest<Body, Response>(url: string, body: Body): Observable<Response> {
        return this.http.patch<Response>( url, body );
    }

    constructor(
        protected readonly http: HttpClient
    ) {
    }
}
