import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../../services/auth-service/auth-service.service';
import { DebateService } from '../../../../services/debate-service/debate.service';

@Component({
  selector: 'app-my-debates',
  templateUrl: './my-debates.component.html',
  styleUrl: './my-debates.component.css'
})
export class MyDebatesComponent implements OnInit {

  constructor(private _debate:DebateService, private _auth:AuthServiceService) { }

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
