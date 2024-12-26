import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../../services/auth-service/auth-service.service';
import { DebateService } from '../../../../services/debate-service/debate.service';

@Component({
  selector: 'app-liked-debates',
  templateUrl: './liked-debates.component.html',
  styleUrl: './liked-debates.component.css',
})
export class LikedDebatesComponent implements OnInit {
  constructor(
    private _debate: DebateService,
    private _auth: AuthServiceService
  ) {}

  debates: any = [];

  userId: any;

  ngOnInit(): void {
    this.userId = this._auth.getUser().id;
    this._debate.getLikedDebatesByUser(this.userId).subscribe((res: any) => {
      console.log(res);
      this.debates = res;
    });
  }
}
