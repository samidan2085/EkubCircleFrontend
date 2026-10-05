import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-other-member',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './other-member.component.html',
  styleUrls: ['./other-member.component.scss']
})
export class OtherMemberComponent {
  organizerName = 'Abebe Bikla';
  activeCircle = {
    id: 1,
    name: 'Tech Colleagues Ekub',
    cadence: 'Weekly',
    membersCount: 4,
    status: 'ACTIVE (Round 2 of 4)'
  };

  // Full roster of members in the circle for organizer management
  circleMembers = [
    { id: 1, name: 'Abebe Bikila', role: 'Host / Organizer', contributionStatus: 'PAID (Round 2)', potStatus: 'Won Round 1', contact: '+251 91 100 2233' },
    { id: 2, name: 'Sara Mohammed', role: 'Member', contributionStatus: 'PAID (Round 2)', potStatus: 'Winning Round 2', contact: '+251 92 233 4455' },
    { id: 3, name: 'Dawit Yohannes', role: 'Member', contributionStatus: 'PAID (Round 2)', potStatus: 'Scheduled Round 3', contact: '+251 93 444 5566' },
    { id: 4, name: 'Tigist Haile', role: 'Member', contributionStatus: 'UNPAID (Pending)', potStatus: 'Scheduled Round 4', contact: '+251 94 555 7788' }
  ];

  constructor(private router: Router) {}

  addMemberModal() {
    alert('Opening Add Member dialog / form...');
  }

  verifyPayment(member: any) {
    member.contributionStatus = 'PAID (Verified)';
    alert(`Payment manually verified and recorded for ${member.name}.`);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}