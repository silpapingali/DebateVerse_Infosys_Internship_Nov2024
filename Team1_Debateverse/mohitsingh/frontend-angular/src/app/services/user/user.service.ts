import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http:HttpClient) { }

  baseUrl:string = "http://localhost:8080/api/user";

  getAllUsers(){
    return this._http.get(`${this.baseUrl}/all`);
  }

  blockUser(id:any){
    return this._http.put(`${this.baseUrl}/block/${id}`, {});
  }

  unblockUser(id:any){
    return this._http.put(`${this.baseUrl}/unblock/${id}`, {});
  }
}
