import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  constructor(private _auth: AuthServiceService) {}

  isLogged: any = false;
  user: any = null;
  userRole: any = null;

  ngOnInit() {
    // console.log(this._auth.isLoggedIn());
    this._auth.isLoggedIn$.subscribe((loggedInStatus) => {
      this.isLogged = loggedInStatus;
      if(loggedInStatus) {
        console.log('User is logged in');
        this.user = this._auth.getUser();
        this.userRole = this.user.role;
        // console.log(this.user);
      }
    });
  }

  logout(event: Event) {
    event.preventDefault();
    this._auth.logoutUser();
  }
}
