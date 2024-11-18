import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  user: any = {
    email: '',
    password: '',
  };

  confirmPass: any = '';

  constructor(
    private _auth: AuthServiceService,
    private _snack: MatSnackBar,
    private _router: Router
  ) {}

  register() {
    if (this.user.password !== this.confirmPass) {
      this._snack.open('Passwords do not match', 'Close', {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
      return;
    }

    console.log(this.user);

    this._auth.register(this.user).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log(res.message);
          this._snack.open(res.message || 'User registered successfully', 'Close', {
            duration: 2000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
          this._router.navigate(['/verify-email'], {
            queryParams: { email: this.user.email },
          });
        } else {
          this._snack.open(res.message || 'Registration failed', 'Close', {
            duration: 2000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
        }
      },
      error: (err) => {
        console.log(err);
        this._snack.open(err.error.message || 'Something went wrong!', 'Close', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
        });
      },
    });
  }

}
