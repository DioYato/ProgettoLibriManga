import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  nome: string;
  cognome: string;
  ruolo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // Stato dell'utente per la gestione del profilo
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private api = 'http://localhost:8080/utenti';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initUser();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Caricamento iniziale sicuro per SSR
  private initUser() {
    if (this.isBrowser()) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.userSubject.next(JSON.parse(stored));
      }
    }
  }

  // Aggiorna i dati dell'utente sul DB e sincronizza il carrello locale
  update(id: number, data: any) {
    const payload = { ...data, id };
    
    // Rimuove la password se non è stata modificata
    if (payload.password === '') {
      delete payload.password;
    }

    return this.http.put<User>(`${this.api}/update`, payload).pipe(
      tap((updatedUser) => {
        // Uniamo i dati ricevuti per non perdere campi 
        const finalUser = { ...updatedUser, ...payload };
        delete finalUser.password;

        if (this.isBrowser()) {
          localStorage.setItem('user', JSON.stringify(finalUser));
        }
        
        this.userSubject.next(finalUser);
        
      })
    );
  }
}