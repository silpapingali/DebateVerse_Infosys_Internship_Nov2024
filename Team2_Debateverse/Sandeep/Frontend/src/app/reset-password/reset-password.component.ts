import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterModule], // Ensure FormsModule is imported
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  password: string = '';
  confirmPassword: string = '';

  onSubmit() {
    console.log('Reset Password form submitted');
    console.log(`Password: ${this.password}, Confirm Password: ${this.confirmPassword}`);

    if (this.password === this.confirmPassword) {
      console.log('Password reset successfully!');
      // Add your password reset logic here
    } else {
      console.error('Passwords do not match!');
    }
  }
}
