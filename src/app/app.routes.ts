import { Routes } from '@angular/router';
import { CreateEkubComponent } from './features/organizer/create-ekub.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ChangePasswordComponent } from './features/member/change-password/change-password.component';
import { OrganizerDashboardComponent } from './features/organizer/organizer-dashboard.component';
import { MemberHomeComponent } from './features/member/member-home.component';
import { AddMemberComponent } from './features/organizer/add-member.component';
import { CircleDetailComponent } from './features/member/circle-detail/circle-detail.component';
import { RoundHistoryComponent } from './features/organizer/round-history/round-history.component';
import { OtherMemberComponent } from './features/organizer/other-member/other-member.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  

  { 
    path: 'member/change-password', 
    component: ChangePasswordComponent,
    //canActivate: [authGuard]
  },
  { path: '', redirectTo: 'organizer/dashboard', pathMatch: 'full' },

  // Organizer Routes
  { path: 'organizer/dashboard', component: OrganizerDashboardComponent },
  { path: 'organizer/circles/:id/other-members', component: OtherMemberComponent },

  // Member Routes
  { path: 'member/dashboard', component: MemberHomeComponent },
  { 
  path: 'organizer/dashboard', 
  component: OrganizerDashboardComponent,
  //canActivate: [authGuard] 
},
{ 
    path: 'organizer/circles/:id/history', 
    component: RoundHistoryComponent 
  },
{ 
  path: 'member/circle/:id', 
  component: CircleDetailComponent,
  //canActivate: [authGuard] 
},
  { 
    path: 'member/home', 
    component: MemberHomeComponent,
   // canActivate: [authGuard]
  },
  { 
  path: 'organizer/create-ekub', 
  component: CreateEkubComponent,
  // canActivate: [authGuard]
},
{ 
  path: 'organizer/circles/:id/add-member', 
  component: AddMemberComponent,
  //canActivate: [authGuard] 
}
  //{ path: '**', redirectTo: 'login' }
];