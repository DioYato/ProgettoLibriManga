import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];

/**
 * Nota SSR/Prerender:
 * - Le rotte dinamiche con parametri (come `products/:id`) non possono essere prerenderizzate
 *   senza fornire la lista dei parametri a build-time.
 *
 * Opzioni quando il backend sarà disponibile:
 * - Lasciare `RenderMode.Server` (funziona con qualsiasi id, senza lista a build-time)
 * - Oppure tornare a `Prerender` e aggiungere una `getPrerenderParams` che restituisca
 *   tutti gli id/slug dei prodotti dal backend (es. chiamando un’API o leggendo un file build-time).
 */
