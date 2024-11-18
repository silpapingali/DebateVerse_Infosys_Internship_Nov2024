import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  role = 'USER';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }
    const userData = { email: this.email, password: this.password, role: this.role };
    this.http.post('http://localhost:8090/api/auth/register', userData)
      .subscribe({
        next: () => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      }, 
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = error.error;
      }
      });
  }
}
