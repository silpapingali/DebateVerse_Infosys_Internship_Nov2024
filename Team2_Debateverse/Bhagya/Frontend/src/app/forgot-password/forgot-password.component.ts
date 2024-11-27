import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';  // User's email input

  // Optional: You can handle form submission logic here (e.g., sending email to backend)
  onSubmit() {
    // Simulate forgot password logic here
    console.log('Password reset requested for:', this.email);

    // Add actual backend logic for sending the reset link or verification (if needed)
    // You can handle validation or redirect logic based on your requirements
  }
}
