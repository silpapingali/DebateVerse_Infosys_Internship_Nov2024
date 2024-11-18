import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  email: string = '';

  constructor(private _auth:AuthServiceService) {}

  resetPassword() {
    console.log(this.email);
    this._auth.forgotPassword(this.email);
    this.email = '';
  }

}
