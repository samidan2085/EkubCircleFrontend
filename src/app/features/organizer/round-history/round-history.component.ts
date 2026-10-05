import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-round-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './round-history.component.html',
  styleUrls: ['./round-history.component.scss']
})
export class RoundHistoryComponent {
  activeFilter = 'all';

  roundsData = [
    {
      roundNumber: 1,
      recipientName: 'Abebe Bikla (Host)',
      recipientEmail: 'organizer@hackathon.local',
      potAmount: '8,000 ETB',
      disbursalDate: '2026-10-01 (14:30)',
      collectionAudit: '4/4 Members Paid (100%)',
      status: 'PAID OUT',
      statusClass: 'badge-success'
    },
    {
      roundNumber: 2,
      recipientName: 'Sara Mohammed',
      recipientEmail: 'sara@hackathon.local',
      potAmount: '8,000 ETB',
      disbursalDate: '— Pending (100%)',
      collectionAudit: '3/4 Members Paid (75%)',
      status: 'IN PROGRESS',
      statusClass: 'badge-warning'
    },
    {
      roundNumber: 3,
      recipientName: 'Dawit Yohannes',
      recipientEmail: 'dawit@hackathon.local',
      potAmount: '8,000 ETB',
      disbursalDate: '— Scheduled',
      collectionAudit: '0/4 Members Paid (0%)',
      status: 'UPCOMING',
      statusClass: 'badge-neutral'
    },
    {
      roundNumber: 4,
      recipientName: 'Tigist Haile',
      recipientEmail: 'tigist@hackathon.local',
      potAmount: '8,000 ETB',
      disbursalDate: '— Scheduled',
      collectionAudit: '0/4 Members Paid (0%)',
      status: 'UPCOMING',
      statusClass: 'badge-neutral'
    }
  ];

  setFilter(filter: string) {
    this.activeFilter = filter;
  }
}