import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { User } from '../models/user.model';

export interface Credentials {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class ConnexionService {
  private readonly http = inject(HttpClient);
  private BASE_URL = 'http://localhost:8000';

  user = signal<User | null | undefined>(undefined);

  login(credentials: Credentials): Observable<User> {
    const fakeUser: User = {
      nom: 'Fall',
      prenom: 'Souleymane',
      email: credentials.email,
      password: credentials.password
    };
    return this.http.post(this.BASE_URL + 'sessions/login', credentials).pipe(
      tap((result: any) => {
        localStorage.setItem('token', result['token']);
        const user = Object.assign(fakeUser, result['user']);
        this.user.set(user);
      })
    )
  }
}
