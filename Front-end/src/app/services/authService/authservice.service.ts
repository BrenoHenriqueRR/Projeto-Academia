import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  static logout: any;

  constructor() {}

  isLoggedIn(): boolean {
    const clientId = localStorage.getItem('idcliente');
    return clientId !== null;
  }

  logout(): void {
    localStorage.removeItem('idcliente');
  }
}


