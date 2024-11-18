import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthServiceService,
    private _snack: MatSnackBar
  ) {}

  isValidToken: boolean = false;
  newPassword: string = '';
  newConfPassword: string = '';

  ngOnInit() {
    // Extract the token from the URL
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.validateResetToken(token).subscribe({
        next: (res) => {
          console.log('Token is valid:', res);
          // Allow user to reset password
          this.isValidToken = true;
        },
        error: (err) => {
          console.error('Invalid or expired token:', err);
          // Redirect to an error page or show an error message
          this.router.navigate(['/error']),  {
            queryParams: { message: 'Invalid or expired token' },
          };
        },
      });
    } else {
      console.error('No token provided in the URL');
      // Redirect to a safe page
      this.router.navigate(['/']);
    }
  }

  submitReset() {
    const token: string | null = this.route.snapshot.queryParamMap.get('token');
    console.log('Token:', token);

    // Ensure the token is present
    if (!token) {
      console.error('No token found in the URL');
      this.router.navigate(['/error'], {
        queryParams: { message: 'No token provided' },
      });
      return;
    }

    // Check if passwords match
    if (this.newPassword !== this.newConfPassword) {
      console.error('Passwords do not match');
      this._snack.open('Passwords do not match', 'Close', {
        duration: 3000,
      });
      return;
    }

    // Call the resetPassword API
    this.authService.resetPassword(this.newPassword, token).subscribe({
      next: (res) => {
        console.log('Password reset successfully:', res);
        // Redirect to the login page with a success message
        this.router.navigate(['/login']);
        this._snack.open('Password reset successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Error resetting password:', err);
        this.router.navigate(['/error'], {
          queryParams: { message: 'Error resetting password. Try again.' },
        });
      },
    });
  }

}
