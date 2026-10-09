import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* =========================
   INTERFACES
========================= */

export interface CircleMember {
  id?: string;
  userId: string;
  name: string;
  email: string;
  joinedAt?: string;
}

export interface MemberPayment {
  memberId: string;
  fullName: string;
  hasPaid: boolean;
  hasReceived: boolean;
}

export interface RoundInfo {
  id?: string;
  roundNumber: number;
  status: string;
  designatedReceiver: string;
  receiverId?: string;
  contributionAmount?: number;
  potAmount?: number;
  paidMemberCount?: number;
  totalMemberCount?: number;
  isCompleted?: boolean;
}

export interface CircleDetail {
  id?: string;
  circleId: string;
  name: string;
  contributionAmount: number;
  meetingLabel: string;
  status: string;
  currentRoundNumber: number;
  members: MemberPayment[];
  rounds: RoundInfo[];
  memberCount?: number;
  createdAt?: string;
}

export interface CircleResponse {
  id?: string;
  circleId?: string;
  name: string;
  contributionAmount: number;
  meetingLabel: string;
  status: string;
  memberCount?: number;
  currentRoundNumber?: number;
}

export interface CreateCircleRequest {
  name: string;
  contributionAmount: number;
  meetingLabel: string;
}

export interface AddMemberRequest {
  name: string;
  email: string;
  temporaryPassword: string;
}

export interface MemberResponse {
  id?: string;
  userId: string;
  name: string;
  email: string;
  joinedAt?: string;
}
export interface MemberDashboard {
  circleId: string;
  circleName: string;
  contributionAmount: number;
  meetingLabel: string;
  circleStatus: string;
  currentRoundNumber: number;
  roundStatus: string;
  receiverName: string;
  potAmount: number;
  hasPaid: boolean;
  hasReceived: boolean;
  paidMemberCount: number;
  totalMemberCount: number;
  members: MemberPayment[];
}

export interface MemberTransaction {
  paymentId: string;
  memberId: string;
  memberName: string;
  roundNumber: number;
  amount: number;
  paidAt: string;
  status: string;
}

export interface TogglePaymentRequest {
  circleId: string;
  roundNumber: number;
  memberId: string;
}

export interface RoundResponse {
  id?: string;
  circleId: string;
  roundNumber: number;
  receiverId: string;
  contributionAmount: number;
  potAmount: number;
  paidMemberCount: number;
  totalMemberCount: number;
  isCompleted: boolean;
}

/* =========================
   CIRCLE SERVICE
========================= */

@Injectable({
  providedIn: 'root'
})
export class CircleService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5034/api/circles';
  private readonly roundsUrl = 'http://localhost:5034/api/rounds';
  private readonly paymentsUrl = 'http://localhost:5034/api/payments';

  /* =========================
     CIRCLE MANAGEMENT
  ========================= */

  // Create a new circle
  createCircle(
    request: CreateCircleRequest
  ): Observable<CircleResponse> {
    return this.http.post<CircleResponse>(
      this.apiUrl,
      request
    );
  }

  // Get all circles
  getAllCircles(): Observable<CircleResponse[]> {
    return this.http.get<CircleResponse[]>(
      this.apiUrl
    );
  }

  // Get the organizer's circle
  getMyCircle(): Observable<CircleDetail> {
    return this.http.get<CircleDetail>(
      `${this.apiUrl}/my`
    );
  }

  // Get one circle by ID
  getCircle(circleId: string): Observable<CircleDetail> {
    return this.http.get<CircleDetail>(
      `${this.apiUrl}/${circleId}`
    );
  }

  // Start the circle
  startCircle(circleId: string): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}/${circleId}/start`,
      {}
    );
  }

  /* =========================
     MEMBER MANAGEMENT
  ========================= */

  // Get all members in a circle
  getMembers(circleId: string): Observable<MemberResponse[]> {
    return this.http.get<MemberResponse[]>(
      `${this.apiUrl}/${circleId}/members`
    );
  }

  // Add a member to a circle
  addMember(
    circleId: string,
    request: AddMemberRequest
  ): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}/${circleId}/members`,
      request
    );
  }

  /* =========================
     MEMBER DASHBOARD
  ========================= */

  // Get the logged-in member's dashboard
  getMyMemberDashboard(): Observable<MemberDashboard> {
    return this.http.get<MemberDashboard>(
      `${this.apiUrl}/member/my`
    );
  }

  /* =========================
     PAYMENT MANAGEMENT
  ========================= */

  // Organizer records or toggles a member's payment
  togglePayment(
    request: TogglePaymentRequest
  ): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}/rounds/toggle-payment`,
      request
    );
  }

  // Member records their own payment
  makeMemberPayment(circleId: string): Observable<unknown> {
    return this.http.post(
      `${this.paymentsUrl}/${circleId}`,
      {}
    );
  }

  /* =========================
     ROUND MANAGEMENT
  ========================= */

  // Get the current round
  getRounds(circleId: string): Observable<RoundResponse> {
    return this.http.get<RoundResponse>(
      `${this.roundsUrl}/${circleId}`
    );
  }

  // Complete the current round and pay the receiver
  completeRound(circleId: string): Observable<unknown> {
    return this.http.post(
      `${this.roundsUrl}/${circleId}/complete`,
      {}
    );
  }

  /* =========================
     TRANSACTION HISTORY
  ========================= */

  // Requires GET /api/circles/{circleId}/transactions in the backend
  getTransactions(
    circleId: string
  ): Observable<MemberTransaction[]> {
    return this.http.get<MemberTransaction[]>(
      `${this.apiUrl}/${circleId}/transactions`
    );
  }
}