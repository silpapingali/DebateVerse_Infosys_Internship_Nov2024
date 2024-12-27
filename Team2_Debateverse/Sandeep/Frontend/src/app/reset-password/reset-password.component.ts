import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    console.log('Reset Password form submitted');

    if (this.password === this.confirmPassword) {
      const resetData = { password: this.password };

      // Call backend to reset password
      this.http.post('http://localhost:3000/api/reset-password', resetData).subscribe(
        (response: any) => {
          alert('Password reset successfully!');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error resetting password:', error);
          alert('Failed to reset password. Please try again.');
        }
      );
    } else {
      alert('Passwords do not match!');
    }
  }
}
