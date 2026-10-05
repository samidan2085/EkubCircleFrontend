// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.services';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (!authService.isLoggedIn()) {
//     router.navigate(['/login']);
//     return false;
//   }

//   if (authService.mustChangePassword() && state.url !== '/member/change-password') {
//     router.navigate(['/member/change-password']);
//     return false;
//   }

//   return true;
// };