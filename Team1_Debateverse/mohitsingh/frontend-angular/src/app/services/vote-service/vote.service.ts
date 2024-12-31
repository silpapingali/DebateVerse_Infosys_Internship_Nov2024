import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(private _http:HttpClient) { }

  baseUrl: string = 'http://localhost:8080/api/votes';

  getVotesByUser(userId: any, debateId: any) {
    return this._http.get(`${this.baseUrl}/${userId}/${debateId}`);
  }

  vote(voteReq: any) {
    return this._http.put(`${this.baseUrl}/save`, voteReq, {responseType: 'text'});
  }
}
