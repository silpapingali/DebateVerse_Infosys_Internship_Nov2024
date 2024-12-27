import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // To make HTTP requests
import { Router, RouterLink } from '@angular/router';  // For navigation after registration
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  name: string = '';  // Added name field
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = '';  // Added role field
  registrationSuccess: boolean = false;  // Flag to control success message visibility
  errorMessage: string = '';  // Error message to display if registration fails

  constructor(private http: HttpClient, private router: Router) {}

  // Handle form submission
  onSubmit() {
    // Validate form fields
    if (this.email=== "admin1@mail.com"||this.email=== "admin2@mail.com"||this.email=== "admin3@mail.com") {
      this.role="admin";
    }
    else{
      this.role="user";
    }

    if (this.password !== this.confirmPassword) {
      // If passwords don't match, show an error
      this.errorMessage = 'Passwords do not match!';
      alert(this.errorMessage);
      return;
    }

    const registrationData = {
      name: this.name,  // Send the name along with email, password, and role
      email: this.email,
      password: this.password,
      role: this.role   // Include role in the registration data
    };

    // Send registration data to the backend
    this.http.post('http://localhost:3000/api/register', registrationData).subscribe(
      (response: any) => {
        this.registrationSuccess = true;  // Show success message
        this.errorMessage = '';
        console.log(response.message);  // Log the success message from backend
      },
      (error: any) => {
        this.registrationSuccess = false;
        this.errorMessage = error.error.message || 'Registration failed';  // Capture any error message
        console.error('Registration failed:', error);
        alert(this.errorMessage);  // Display error message to the user
      }
    );
  }
}
