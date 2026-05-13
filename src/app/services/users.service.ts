import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private api = 'http://localhost:8080/utenti';

  constructor(private http: HttpClient) {
    this.initUser();
  }

  private initUser() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.userSubject.next(JSON.parse(stored));
    }
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/findById?id=${id}`);
  }

  update(id: number, data: Partial<User>): Observable<User> {
    const payload = { ...data, id };

    if (payload.password === '') {
      delete payload.password;
    }

    return this.http.put<User>(`${this.api}/update`, payload).pipe(
      tap((updatedUser) => {
        const finalUser = { ...this.userSubject.getValue(), ...updatedUser, ...payload };
        delete finalUser.password;

        localStorage.setItem('user', JSON.stringify(finalUser));
        this.userSubject.next(finalUser as User);
      })
    );
  }

  addImage(id: number, image: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('id', id.toString());
    formData.append('tipo', 'utente');
    return this.http.post<void>('http://localhost:8080/rest/upload/image', formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/delete?id=${id}`);
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}