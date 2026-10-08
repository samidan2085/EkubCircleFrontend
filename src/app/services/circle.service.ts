import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Circle } from '../models/circle.model';

@Injectable({
  providedIn: 'root'
})
export class CircleService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5034/api/circles';

  getOrganizerCircles(): Observable<Circle[]> {
    return this.http.get<Circle[]>(this.apiUrl);
  }

  createCircle(data: { name: string; contributionAmount: number; meetingSchedule: string }): Observable<Circle> {
    return this.http.post<Circle>(this.apiUrl, data);
  }

  addMember(circleId: string, memberData: { fullName: string; email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${circleId}/members`, memberData);
  }

  startCircle(circleId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${circleId}/start`, {});
  }

  recordPayment(roundId: string, memberId: string): Observable<any> {
    return this.http.post(`https://localhost:5034/api/rounds/${roundId}/payments`, { memberId });
  }

  triggerPayout(roundId: string): Observable<any> {
    return this.http.post(`https://localhost:5034/api/rounds/${roundId}/payout`, {});
  }

  getMemberDashboard(): Observable<any> {
    return this.http.get('https://localhost:5034/api/member/dashboard');
  }
}