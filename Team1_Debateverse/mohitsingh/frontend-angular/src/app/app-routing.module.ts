import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailVerifyComponent } from './auth/email-verify/email-verify.component';
import { ErrorComponent } from './auth/error/error.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { authGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AboutComponent } from './pages/home-routes/about/about.component';
import { DebatePollComponent } from './pages/home-routes/debate-poll/debate-poll.component';
import { DebatesComponent } from './pages/home-routes/debates/debates.component';
import { HomeRoutesComponent } from './pages/home-routes/home-routes.component';
import { HomeComponent } from './pages/home-routes/home/home.component';
import { CreateDebateComponent } from './pages/home-routes/user-dashboard/create-debate/create-debate.component';
import { DashboardComponent } from './pages/home-routes/user-dashboard/dashboard/dashboard.component';
import { LikedDebatesComponent } from './pages/home-routes/user-dashboard/liked-debates/liked-debates.component';
import { MyDebatesComponent } from './pages/home-routes/user-dashboard/my-debates/my-debates.component';
import { UserDashboardComponent } from './pages/home-routes/user-dashboard/user-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: HomeRoutesComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [authGuard] },
      { path: 'about', component: AboutComponent, canActivate: [authGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [authGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'verify-email', component: EmailVerifyComponent },
      { path: 'debates', component: DebatesComponent },
      { path: 'login', component: LoginComponent, canActivate: [authGuard] },
      { path: 'debate/:id', component: DebatePollComponent },
      { path: 'error', component: ErrorComponent },
      {
        path: 'user',
        component: UserDashboardComponent,
        children: [
          { path: '', component: DashboardComponent },
          { path: 'debates', component: MyDebatesComponent },
          { path: 'liked-debates', component: LikedDebatesComponent },
          { path: 'create-debate', component: CreateDebateComponent }
        ],
      },
    ],
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
