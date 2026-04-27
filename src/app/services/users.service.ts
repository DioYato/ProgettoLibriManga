import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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
  ) {
    this.initUser();
  }

  // Caricamento iniziale sicuro per SSR
  private initUser() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.userSubject.next(JSON.parse(stored));
    }
  }

  getById(id: number) {
    return this.http.get<any>(`http://localhost:8080/utenti/findById?id=${id}`);
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

        localStorage.setItem('user', JSON.stringify(finalUser));

        this.userSubject.next(finalUser);

      })
    );
  }

  addImage(id: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('id', id.toString());
    formData.append('tipo', 'utente');
    return this.http.post('http://localhost:8080/rest/upload/image', formData);
  }
}