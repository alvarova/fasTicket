import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: `login.Component.html`,
  styleUrl: `login.component.css`
})
export class LoginComponent {
  cuit = '';
  pin = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.login(this.cuit, this.pin).subscribe(success => {
      if (success) {
        this.router.navigate(['/ticket']);
      }
    });
  }

  onLogin() {
    this.authService.login(this.cuit, this.pin).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/ticket']);
        } else {
          // Show error message using your preferred UI method
          // For example, if using Angular Material:
          this.showErrorMessage(response.message);
        }
      },
      error: (error) => {
        this.showErrorMessage('An error occurred during login');
      }
    });
  }

  private showErrorMessage(message: string) {
    // Implement this according to your UI framework
    // For example, if using Angular Material:
    // this.snackBar.open(message, 'Close', { duration: 3000 });
    console.log('Error: ' + message);
  }
}