import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private _auth: AuthServiceService, private _snack:MatSnackBar) {}

  register() {
    console.log(this.user);
    this._auth.register(this.user).subscribe({
      next: (res) => {
        console.log(res);
        this._snack.open('User registered successfully', 'Close', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
        });
      },
      error: (err) => {
        console.log(err);
        this._snack.open('Error registering user', 'Close', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
        });
      }
    });
  }
}
