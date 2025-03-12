import { Injectable } from '@angular/core';
import { User } from '../models/data.models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Simulated user database - replace with real backend integration
  private readonly MOCK_USER: User = {
    cuit: '20-12345678-9',
    pin: '1234'
  };

  constructor() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(cuit: string, pin: string): Observable<boolean> {
    // Validate CUIT format (xx-xxxxxxxx-x)
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(cuit)) {
      return of(false);
    }

    // Simulate API call - replace with real authentication
    return of(cuit === this.MOCK_USER.cuit && pin === this.MOCK_USER.pin).pipe(
      map(isValid => {
        if (isValid) {
          const user: User = { cuit, pin };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return isValid;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}