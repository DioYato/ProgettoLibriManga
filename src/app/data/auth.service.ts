import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  nome: string;
  cognome: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Carica utente da localStorage se presente
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Quando il backend sarà pronto, valida il token e carica l'utente
      // this.validateToken().subscribe(user => this.userSubject.next(user));
    }
  }

  // Mock per registrazione - quando backend pronto, sostituisci con chiamata HTTP
  register(userData: { nome: string; cognome: string; email: string; password: string }): Observable<any> {
    // TODO: Quando il backend sarà pronto, usa:
    // return this.http.post('/api/auth/register', userData);
    console.log('Registrazione mock:', userData);
    return of({ success: true, message: 'Registrazione completata (mock)' });
  }

  // Mock per login - quando backend pronto, sostituisci con chiamata HTTP
  login(credentials: { email: string; password: string }): Observable<any> {
    // TODO: Quando il backend sarà pronto, usa:
    // return this.http.post('/api/auth/login', credentials).pipe(
    //   tap(response => {
    //     localStorage.setItem('token', response.token);
    //     this.userSubject.next(response.user);
    //   })
    // );
    console.log('Login mock:', credentials);
    // Simula successo
    const mockUser: User = { id: 1, email: credentials.email, nome: 'Mock', cognome: 'User' };
    localStorage.setItem('token', 'mock-token');
    this.userSubject.next(mockUser);
    return of({ success: true, user: mockUser, token: 'mock-token' });
  }

  // Mock per logout - quando backend pronto, aggiungi chiamata HTTP se necessario
  logout(): void {
    // TODO: Quando il backend sarà pronto, usa:
    // this.http.post('/api/auth/logout', {}).subscribe();
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  // Metodo per validare token - quando backend pronto
  // private validateToken(): Observable<User> {
  //   return this.http.get<User>('/api/auth/validate');
  // }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}