import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatarService {

  constructor() { }
  formatarPreco(valor: string): string {
    return valor.replace(/\./g, '').replace(',', '.');
  }

  formatarData(data: string): any {
    if (data && data.length === 8) {
      let dia = data.substring(0, 2);
      let mes = data.substring(2, 4);
      let ano = data.substring(4, 8);
      let dataFormatada = `${ano}-${mes}-${dia}`;

      return dataFormatada ;
    }
  }
}
