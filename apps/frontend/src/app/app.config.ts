import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MatchService } from './_shared/services/match.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      // make sure that match service is initialized even if it's not used
      inject(MatchService);
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
