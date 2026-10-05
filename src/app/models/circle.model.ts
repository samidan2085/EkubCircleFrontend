export interface Circle {
  id: string;
  name: string;
  contributionAmount: number;
  totalRounds: number;
  currentRoundNumber: number;
  status: 'Forming' | 'Active' | 'Completed';
  meetingSchedule: string;
  members: CircleMember[];
  rounds: Round[];
}

export interface CircleMember {
  id: string;
  username: string;
  fullName: string;
  email: string;
  temporaryPassword?: string;
  mustChangePassword: boolean;
  hasReceived: boolean;
  payoutOrder: number;
}

export interface Round {
  id: string;
  roundNumber: number;
  receiverId: string;
  receiverName: string;
  potAmount: number;
  status: 'Open' | 'PaidOut';
  payments: Payment[];
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  hasPaid: boolean;
  paidAt?: string;
}