import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(private _http:HttpClient) { }

  baseUrl: string = 'http://localhost:8080/api/votes';

  getVotesByUser(userId: any) {
    return this._http.get(`${this.baseUrl}/user/${userId}`);
  }

  vote(voteReq: any) {
    return this._http.post(`${this.baseUrl}/save`, voteReq);
  }
}
