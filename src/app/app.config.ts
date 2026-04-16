import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling} from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http'; // Aggiunto withFetch qui

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled', // Opzionale: abilita lo scroll agli ancoraggi (#id)
      })
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()) 
  ]
};
