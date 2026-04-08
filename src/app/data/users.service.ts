import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
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
export class UsersService {

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private api = 'http://localhost:8080/utenti';

  constructor(private http: HttpClient, private router: Router) {
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  update(id: number, data: any) {
    data.id = id;
    if (data.password === '') {
      delete data.password;
    }
    return this.http.put(`${this.api}/update`, data).pipe(
      tap((user: any) => {
        user = { ...user, ...data };
        delete user.password;
        if (this.isBrowser()) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        this.userSubject.next(user);
      })
    );
  }
}