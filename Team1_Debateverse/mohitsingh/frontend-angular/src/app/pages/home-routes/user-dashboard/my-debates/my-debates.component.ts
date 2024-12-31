import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../../services/auth-service/auth-service.service';
import { DebateService } from '../../../../services/debate-service/debate.service';

@Component({
  selector: 'app-my-debates',
  templateUrl: './my-debates.component.html',
  styleUrl: './my-debates.component.css',
})
export class MyDebatesComponent implements OnInit {
  constructor(
    private _debate: DebateService,
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

  myDebates: any[] = [];

  totalVotes: number = 0;

  ngOnInit() {
    this._debate.getDebatesByUser(this._auth.getUser().id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.myDebates = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
