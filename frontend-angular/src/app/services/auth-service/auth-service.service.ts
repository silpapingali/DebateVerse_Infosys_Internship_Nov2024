import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private _http:HttpClient) { }

  register(user:any){
    return this._http.post('http://localhost:8080/api/user/', user);
  }
}
