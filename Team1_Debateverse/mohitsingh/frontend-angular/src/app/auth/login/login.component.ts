import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private _auth: AuthServiceService,
    private _router: Router,
    private _snack: MatSnackBar
  ) {}

  user: any = {
    email: '',
    password: '',
  };

  errors: any = '';

  login() {
    this.errors = '';
    console.log(this.user);
    this._auth.login(this.user).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this._auth.loggedIn$.next(true);
        if (res.user.role === 'ADMIN') {
          this._router.navigate(['/admin']);
        } else if (res.user.role === 'USER') {
          this._router.navigate(['/user/dashboard']);
        }
        this._snack.open('Login Successful', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.log(err);
        if (err.error.message) this.errors = err.error.message;
        else
          this._snack.open('Server Unavailable!', 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
      },
    });
  }
}
