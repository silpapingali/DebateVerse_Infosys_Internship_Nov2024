import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],  // Add CommonModule here
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  registrationSuccess: boolean = false;  // Flag to control success message visibility

  constructor() {}

  // Handle form submission
  onSubmit() {
    if (this.password === this.confirmPassword) {
      // Simulate registration logic (e.g., saving user details to the backend)
      console.log('User registered with email: ' + this.email);
      
      // Set registration success flag to show the success message
      this.registrationSuccess = true;

      // Optionally, you could also add a timeout to simulate email sending
      setTimeout(() => {
        // Here you would typically navigate to the login page or dashboard
        // For now, it just shows the success message
      }, 3000);
    } else {
      console.error('Passwords do not match!');
    }
  }
}
