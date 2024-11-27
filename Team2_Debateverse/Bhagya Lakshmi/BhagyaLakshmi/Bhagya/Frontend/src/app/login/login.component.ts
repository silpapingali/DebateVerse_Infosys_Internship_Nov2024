import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],  // Import FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  onSubmit() {
    console.log('Login button clicked');
  console.log(`Email: ${this.email}, Password: ${this.password}`);
    // Hardcoded email and password for demonstration
    const validEmail = 'test@example.com';
    const validPassword = 'password123';

    // Check if the entered credentials match the hardcoded ones
    if (this.email === validEmail && this.password === validPassword) {
      console.log('Login successful!');
      // Use Router to navigate (example: to dashboard)
    } else {
      console.error('Invalid email or password');
    }
  }
}
