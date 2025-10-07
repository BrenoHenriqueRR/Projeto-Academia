import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNgxMask } from 'ngx-mask';
import { provideDaterangepickerLocale } from 'ngx-daterangepicker-bootstrap'; // ✅ Import do DateRangePicker

// registra o locale pt-BR do Angular
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNgxMask(),
    provideToastr(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    DatePipe,

    // ✅ Locale global da aplicação
    { provide: LOCALE_ID, useValue: 'pt-BR' },

    // ✅ Configuração do ngx-daterangepicker-bootstrap
    provideDaterangepickerLocale({
      format: 'DD/MM/YYYY',
      displayFormat: 'DD/MM/YYYY',
      direction: 'ltr',
      weekLabel: 'S',
      separator: ' - ',
      applyLabel: 'Aplicar',
      cancelLabel: 'Cancelar',
      clearLabel: 'Limpar',
      customRangeLabel: 'Personalizado',
      daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ],
      firstDay: 0 // domingo
    })
  ],
};
