import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  nome: string;
  cognome: string;
  ruolo?: string;
  immagineProfilo?: string; // Aggiunto per coerenza con il componente
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

  // Ripristina lo stato utente da localStorage
  private initUser() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.userSubject.next(JSON.parse(stored));
    }
  }

  getById(id: number) {
    return this.http.get<any>(`${this.api}/findById?id=${id}`);
  }

  // Aggiorna l'utente sul server e mantiene sincronizzato il local state
  update(id: number, data: any) {
    const payload = { ...data, id };

    // Non inviare la password vuota se l'utente non l'ha cambiata
    if (payload.password === '') {
      delete payload.password;
    }

    return this.http.put<User>(`${this.api}/update`, payload).pipe(
      tap((updatedUser) => {
        // Manteniamo i campi esistenti e usiamo i dati aggiornati
        const finalUser = { ...this.userSubject.getValue(), ...updatedUser, ...payload };
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

  /**
   * Elimina l'utente dal database
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/delete?id=${id}`);
  }

  /**
   * Effettua il logout pulendo localStorage e lo stato dell'utente
   */
  logout() {
    localStorage.removeItem('user');
    // Se usi un token di autenticazione, rimuovilo qui:
    // localStorage.removeItem('token'); 
    this.userSubject.next(null);
  }
}