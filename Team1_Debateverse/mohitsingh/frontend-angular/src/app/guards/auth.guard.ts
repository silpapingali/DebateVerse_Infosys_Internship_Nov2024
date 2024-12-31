import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service/auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);

  // If the user is logged in
  if (authService.isLoggedIn()) {
    // Check if the user is trying to access login or register pages
    if (
      route.routeConfig?.path === 'login' ||
      route.routeConfig?.path === 'register'
    ) {
      // redirect to user / admin dashboard based on role
      if (authService.getUser().role === 'ADMIN') {
        router.navigate(['/admin']);
      } else if (authService.getUser().role === 'USER') {
        router.navigate(['/user/dashboard']);
      }
      return false;
    }

    if (
      route.routeConfig?.path === 'users' ||
      route.routeConfig?.path === 'all-debates' ||
      route.routeConfig?.path === 'update/debate/:id'
    ) {
      if (authService.getUser().role === 'ADMIN') {
        return true;
      }
      router.navigate(['/user/dashboard']);
      return false;
    }

    // Redirect logged-in users to their respective dashboards based on their role
    if (authService.getUser().role === 'ADMIN') {
      console.log('Admin');
      // If the user is already on the admin page, don't navigate
      if (state.url !== '/admin') {
        router.navigate(['/admin']);
      }

      return true; // Prevent navigation to admin if already there
    } else if (authService.getUser().role === 'USER') {
      console.log('User');
      // If the user is already on the user dashboard, don't navigate
      if (state.url !== '/user/dashboard') {
        router.navigate(['/user/dashboard']);
      }
      return true; // Prevent navigation to user dashboard if already there
    }
    return false; // Prevent access to the requested route if the user is logged in
  }

  // Allow access to login/register pages for non-logged-in users
  if (
    route.routeConfig?.path === 'login' ||
    route.routeConfig?.path === 'register'
  ) {
    return true;
  }

  if (
    route.routeConfig?.path === 'users' ||
    route.routeConfig?.path === 'all-debates' ||
    route.routeConfig?.path === 'update/debate/:id'
  ) {
    router.navigate(['/login']);
    return false;
  }

  return true; // Allow access to other routes for non-logged-in users
};
