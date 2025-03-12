import { Injectable } from '@angular/core';
import { User } from '../models/data.models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(cuit: string, pin: string): Observable<{ success: boolean; message: string }> {
    // Validate CUIT format (xx-xxxxxxxx-x)
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(cuit)) {
      return of({ success: false, message: 'Invalid CUIT format' });
    }

    // Simulate API call - replace with real authentication
    const isValid = cuit === this.MOCK_USER.cuit && pin === this.MOCK_USER.pin;
    
    return of(isValid).pipe(
      map(valid => {
        if (valid) {
          const user: User = { cuit, pin };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return { success: true, message: 'Login successful' };
        }
        return { success: false, message: 'Invalid credentials' };
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