import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalProvider } from './global';

@Injectable({
  providedIn: 'root',
})

export class APIBaseService {
  constructor(
    public http: HttpClient,
    public g: GlobalProvider,
  ) { }

  getHeader(params = {}) {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.g.jws}`,
        'customerId': this.g.customerId.toString()
      }),
      params: params
    };
  }

  // errorHandle(err: any) {
  //   this.b.loadLoading(false);
  //   let message = err.error ? err.error.message : err.message;
  //   if (!message) message = err.error ? err.error : 'unknown error';
  //   this.b.toast(`${err.status}: ${message}`, 5000, `danger`);
  // }
}

