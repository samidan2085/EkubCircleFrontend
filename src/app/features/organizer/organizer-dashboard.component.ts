import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.scss']
})
export class OrganizerDashboardComponent {
  organizerName = 'Abebe Bikla';
  organizerEmail = 'organizer@hackathon.local';

  activeCircle = {
    id: 1,
    name: 'Tech Colleagues Ekub',
    cadence: 'Weekly',
    contribution: '2,000 ETB / Week',
    perRoundPot: '8,000 ETB',
    membersCount: 4,
    status: 'ACTIVE (Round 2 of 4)'
  };

  // Table Data representing Organizer Access Modules and Actions with updated other-members link
  organizerModulesTable = [
    {
      id: 1,
      moduleName: 'Circle Overview & Summary',
      targetPage: 'Overview & General Info',
      metricsStatus: 'Health: Optimal (4 Members)',
      actionText: 'View Overview',
      route: ['/organizer/circles', this.activeCircle.id],
      btnClass: 'btn-primary'
    },
    {
      id: 2,
      moduleName: 'Add Member & Roster',
      targetPage: 'Participant & Other Members Management',
      metricsStatus: 'Roster Cap: 4 / 4 Active',
      actionText: 'Manage Members',
      route: ['/organizer/circles', this.activeCircle.id, 'other-members'],
      btnClass: 'btn-secondary'
    },
    {
      id: 3,
      moduleName: 'Live Round Ledger',
      targetPage: 'Active Contributions & Verification',
      metricsStatus: 'Round 2 Progress: 3/4 Paid',
      actionText: 'Open Live Ledger',
      route: ['/organizer/circles', this.activeCircle.id, 'round'],
      btnClass: 'btn-accent'
    },
    {
      id: 4,
      moduleName: 'Historical Winners',
      targetPage: 'Past Round Recipient Audit',
      metricsStatus: 'Round 1 Disbursed (Abebe B.)',
      actionText: 'View History',
      route: ['/organizer/circles', this.activeCircle.id, 'history'],
      btnClass: 'btn-primary'
    }
  ];

  constructor(private router: Router) {}

  createNewEkub() {
    this.router.navigate(['/organizer/circles/create']);
  }

  exportAuditLogs() {
    alert('Audit logs exported successfully as CSV/JSON.');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}