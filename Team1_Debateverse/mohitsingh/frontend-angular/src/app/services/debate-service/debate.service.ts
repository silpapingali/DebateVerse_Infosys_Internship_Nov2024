import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DebateService {
  constructor(private _http: HttpClient) {}

  baseUrl: string = 'http://localhost:8080/api/debates';

  getPublicDebates() {
    return this._http.get(`${this.baseUrl}/public`);
  }

  createDebate(debateReq: any, userId: any) {
    return this._http.post(`${this.baseUrl}/${userId}`, debateReq);
  }

  getDebate(debateId: any) {
    return this._http.get(`${this.baseUrl}/${debateId}`);
  }

  getDebatesByUser(userId: any) {
    return this._http.get(`${this.baseUrl}/user/${userId}`);
  }

  getAllDebatesExceptUser(userId: any, page: number, size: number) {
    return this._http.get(`${this.baseUrl}`, {
      params: { userId: userId, page: page.toString(), size: size.toString() },
    });
  }

  getAllDebates(page: number, size: number) {
    return this._http.get(`${this.baseUrl}/all`, {
      params: { page: page.toString(), size: size.toString() },
    });
  }

  likeDebate(debateId: any, userId: any) {
    return this._http.post(`${this.baseUrl}/${debateId}/like`, null, {
      params: { userId },
    });
  }

  dislikeDebate(debateId: any, userId: any) {
    return this._http.post(`${this.baseUrl}/${debateId}/dislike`, null, {
      params: { userId },
    });
  }

  getLikedDebatesByUser(userId: any) {
    return this._http.get(`${this.baseUrl}/liked`, { params: { userId } });
  }

  blockDebate(debateId: any) {
    return this._http.put(`${this.baseUrl}/${debateId}/block`, {});
  }

  unblockDebate(debateId: any) {
    return this._http.put(`${this.baseUrl}/${debateId}/unblock`, {});
  }
}
