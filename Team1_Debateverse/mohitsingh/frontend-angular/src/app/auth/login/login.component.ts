import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private _auth: AuthServiceService) {}

  user: any = {
    email: '',
    password: '',
  };

  login() {
    console.log(this.user);
    this._auth.login(this.user);
  }
}
