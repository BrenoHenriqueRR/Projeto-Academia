import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';


import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNgxMask } from 'ngx-mask';

registerLocaleData(localePt);
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideNgxMask(),
  provideToastr(),
  provideAnimations(),
  provideHttpClient(withFetch()), provideAnimationsAsync()],
};
