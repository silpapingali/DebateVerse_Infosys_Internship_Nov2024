import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DebateService {

  constructor(private _http:HttpClient) { }

  baseUrl: string = "http://localhost:8080/api/debates";

  getPublicDebates(){
    return this._http.get(`${this.baseUrl}/public`);
  }

  createDebate(debate: any, userId: any){
    return this._http.post(`${this.baseUrl}/${userId}`, debate);
  }

  getDebate(debateId: any){
    return this._http.get(`${this.baseUrl}/${debateId}`);
  }

  getDebatesByUser(userId: any){
    return this._http.get(`${this.baseUrl}/user/${userId}`);
  }

  getAllDebates(){
    return this._http.get(`${this.baseUrl}`);
  }
}
