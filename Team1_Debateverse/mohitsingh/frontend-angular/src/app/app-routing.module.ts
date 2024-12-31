import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailVerifyComponent } from './auth/email-verify/email-verify.component';
import { ErrorComponent } from './auth/error/error.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { authGuard } from './guards/auth.guard';
import { AboutComponent } from './pages/home-routes/about/about.component';
import { AdminDashboardComponent } from './pages/home-routes/admin-dashboard/admin-dashboard.component';
import { AllDebatesComponent } from './pages/home-routes/all-debates/all-debates.component';
import { DebatePollComponent } from './pages/home-routes/debate-poll/debate-poll.component';
import { DebateUpdateComponent } from './pages/home-routes/debate-update/debate-update.component';
import { DebatesComponent } from './pages/home-routes/debates/debates.component';
import { HomeRoutesComponent } from './pages/home-routes/home-routes.component';
import { HomeComponent } from './pages/home-routes/home/home.component';
import { CreateDebateComponent } from './pages/home-routes/user-dashboard/create-debate/create-debate.component';
import { DashboardComponent } from './pages/home-routes/user-dashboard/dashboard/dashboard.component';
import { LikedDebatesComponent } from './pages/home-routes/user-dashboard/liked-debates/liked-debates.component';
import { MyDebatesComponent } from './pages/home-routes/user-dashboard/my-debates/my-debates.component';
import { UserDashboardComponent } from './pages/home-routes/user-dashboard/user-dashboard.component';
import { UsersComponent } from './pages/home-routes/users/users.component';

const routes: Routes = [
  {
    path: '',
    component: HomeRoutesComponent,
    children: [
      { path: '', component: HomeComponent, title: 'Home' },
      { path: 'about', component: AboutComponent, title: 'About' },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [authGuard],
        title: 'Register',
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'Forgot Password',
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'Reset Password',
      },
      {
        path: 'verify-email',
        component: EmailVerifyComponent,
        title: 'Verify Email',
      },
      { path: 'debates', component: DebatesComponent, title: 'Debates' },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [authGuard],
        title: 'Login',
      },
      { path: 'debate/:id', component: DebatePollComponent, title: 'Debate' },
      { path: 'error', component: ErrorComponent, title: 'Error!' },
      {
        path: 'user',
        component: UserDashboardComponent,
        canActivate: [authGuard],
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent,
            title: 'User Dashboard',
          },
          {
            path: 'debates',
            component: MyDebatesComponent,
            title: 'My Debates',
          },
          {
            path: 'liked-debates',
            component: LikedDebatesComponent,
            title: 'Liked Debates',
          },
          {
            path: 'create-debate',
            component: CreateDebateComponent,
            title: 'Create Debate',
          },
        ],
      },
      {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [authGuard],
        title: 'Admin Dashboard',
      },
      {
        path: 'all-debates',
        component: AllDebatesComponent,
        canActivate: [authGuard],
        title: 'All Debates',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [authGuard],
        title: 'All Users',
      },
      {
        path: 'update/debate/:id',
        component: DebateUpdateComponent,
        canActivate: [authGuard],
        title: 'Update Debate',
      },
      {
        path: '**',
        component: PagenotfoundComponent,
        title: 'Page Not Found!',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
