import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionService {

  constructor(private _http:HttpClient) { }

  baseUrl:string = "http://localhost:8080/api/options";

  blockOption(optionId:any, debateId:any){
    return this._http.put(`${this.baseUrl}/block/${debateId}/${optionId}`, {}, {responseType: 'text'});
  }

  unblockOption(optionId:any, debateId:any){
    return this._http.put(`${this.baseUrl}/unblock/${debateId}/${optionId}`, {}, {responseType: 'text'});
  }

}
