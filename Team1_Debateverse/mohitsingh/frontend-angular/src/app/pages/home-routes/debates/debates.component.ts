import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service/auth-service.service';
import { DebateService } from '../../../services/debate-service/debate.service';


@Component({
  selector: 'app-debates',
  templateUrl: './debates.component.html',
  styleUrl: './debates.component.css'
})
export class DebatesComponent implements OnInit {

  constructor(private _auth:AuthServiceService, private _router: Router, private _snack: MatSnackBar, private _debate: DebateService) {
    this._auth.isLoggedIn$.subscribe((res) => {
      if (!res) {
        this._router.navigate(['/login']);
        this._snack.open('Please login to continue', 'Close', {
          duration: 3000,
        });
      }
    });
   }

   allDebates: any[] = [];

   ngOnInit() {
    this._debate.getAllDebatesExceptUser().subscribe({
      next: (res: any) => {
        console.log(res);
        this.allDebates = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


}
