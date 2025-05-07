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

  isLoggedInAdm(): boolean {
    const adminid = localStorage.getItem('idadmin');
    return adminid !== null;
  }

  logout(): void {
    localStorage.removeItem('idcliente');
  }

  logoutadm(): void {
    localStorage.removeItem('idadmin');
    localStorage.removeItem('tipoadmin');
  }
}


