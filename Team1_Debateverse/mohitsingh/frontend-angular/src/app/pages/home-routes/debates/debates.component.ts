import { Component, OnInit } from '@angular/core';
import { DebateService } from '../../../services/debate-service/debate.service';

@Component({
  selector: 'app-debates',
  templateUrl: './debates.component.html',
  styleUrl: './debates.component.css'
})
export class DebatesComponent implements OnInit {

  debates: any =  [];

  constructor(private _debateService: DebateService) {
  }

  ngOnInit(){
    this._debateService.getPublicDebates().subscribe((data: any) => {
      this.debates = data;
      console.log(this.debates);
    });
  }



}
