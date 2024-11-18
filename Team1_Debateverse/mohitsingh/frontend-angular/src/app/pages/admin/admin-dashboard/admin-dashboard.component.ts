import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  constructor(private _auth:AuthServiceService, private _router: Router) {
    this._auth.isLoggedIn$.subscribe((res) => {
      if (!res) {
        this._router.navigate(['/login']);
      }
    });
  }



  logout(event : Event  ) {
    event.preventDefault();
    console.log('Logout');
    this._auth.logoutUser();
  }

}
