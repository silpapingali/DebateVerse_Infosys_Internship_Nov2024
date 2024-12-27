import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    role: '' // Added role property
  };
  isLoading: boolean = false;
  errorMessage: string = ''; // Variable to hold error message

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    // Validate role selection
    if (this.loginData.email=== "admin1@mail.com"||this.loginData.email=== "admin2@mail.com"||this.loginData.email=== "admin3@mail.com") {
      this.loginData.role="admin"
    }
    else{
      this.loginData.role="user"
    }

    this.isLoading = true; // Set loading state to true during API call

    // Post login data to the server
    this.http.post('http://localhost:3000/api/login', this.loginData).subscribe(
      (response: any) => {
        const { userId, token, role } = response; // Ensure these fields are returned by the backend

        // Validate response
        if (userId && token && role) {
          localStorage.setItem('token', token);  // Store JWT token in localStorage
          localStorage.setItem('role', role);   // Store role for additional checks in the app
          // localStorage.setItem('userId', userId);
          // Navigate based on role
          if (role === 'admin') {
            this.router.navigate(['/admin-dashboard']); // Admin-specific route
          } else if (role === 'user') {
            localStorage.setItem('userId', userId);
            this.router.navigate(['/dashboard']); // User-specific route

            // window.location.reload();
          } else {
            this.errorMessage = 'Unknown role provided by the server.';
            alert(this.errorMessage);
          }
        } else {
          this.errorMessage = 'Incomplete response from the server.';
          alert(this.errorMessage);
        }

        this.isLoading = false; // Reset loading state
      },
      (error) => {
        this.isLoading = false; // Reset loading state
        this.errorMessage = error.error.message || 'Login failed'; // Capture any error message
        console.error('Login failed:', error);
        alert('Login failed: ' + this.errorMessage);
      }
    );
  }
}
