import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegistrationComponent } from './registration/registration.component'; // Import RegistrationComponent
import { CreateDebateComponent } from './create-debate/create-debate.component';
import { SearchDebatesComponent } from './search-debates/search-debates.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { HomeComponent } from './home/home.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'register', component: RegistrationComponent },  // Add this route
  { path: 'create-debate', component: CreateDebateComponent },
  { path: 'overall-debates', component: SearchDebatesComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'dashboard', component: UserDashboardComponent },
  { path: '', component:HomeComponent },
  // { path: 'usersearch', component: UserSearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
