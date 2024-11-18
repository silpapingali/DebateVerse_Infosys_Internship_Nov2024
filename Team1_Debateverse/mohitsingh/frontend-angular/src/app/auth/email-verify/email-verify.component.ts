import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrl: './email-verify.component.css',
})
export class EmailVerifyComponent {
  isEmailVerified: boolean = false;
  email: string = '';
  token: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _auth: AuthServiceService
  ) {}

  ngOnInit() {
    console.log('Query:', this._route.snapshot.queryParamMap);
    this.email =
      this._route.snapshot.queryParamMap.get('email') || 'No email provided';
    this.token = this._route.snapshot.queryParamMap.get('token') || '';
    console.log('Email:', this.email);
    console.log('Token:', this.token);
    this._auth.validateEmailToken(this.token).subscribe({
      next: (res) => {
        console.log('Email verified:', res);
        this.isEmailVerified = true;
      },
      error: (err) => {
        console.error('Email verification failed', err);
      },
    });
  }
}
