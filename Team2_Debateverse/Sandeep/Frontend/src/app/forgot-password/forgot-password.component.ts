import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterModule,RouterLink,CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';  // User's email input
  successMessage: string = ''; // To show success message
  errorMessage: string = ''; // To show error message

  constructor(private http: HttpClient) {}

  // Handle form submission
  onSubmit() {
    const payload = { email: this.email };

    // Send the email to the backend to initiate password reset
    this.http.post('http://localhost:3000/api/forgot-password', payload).subscribe(
      (response: any) => {
        this.successMessage = response.message; // Show success message
      },
      (error) => {
        this.errorMessage = error.error.message || 'An error occurred while processing your request.';
        alert(this.errorMessage);
      }
    );
  }
}
