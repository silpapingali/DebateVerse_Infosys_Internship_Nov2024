import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../../services/auth-service/auth-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    private _auth: AuthServiceService,
    private _router: Router,
    private _snack: MatSnackBar
  ) {
    this._auth.isLoggedIn$.subscribe((res) => {
      if (!res) {
        this._router.navigate(['/login']);
        this._snack.open('Please login to continue', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  user: any = {};

  ngOnInit(): void {
    this.user = this._auth.getUser();
  }
}
