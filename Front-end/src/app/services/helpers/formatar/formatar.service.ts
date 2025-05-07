import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatarService {

  constructor() { }
  formatarPreco(valor: string): string {
    return valor.replace(/\./g, '').replace(',', '.');
  }
}
