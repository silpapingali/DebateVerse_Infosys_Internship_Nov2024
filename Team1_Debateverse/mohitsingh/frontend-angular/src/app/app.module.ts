import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  NgxUiLoaderConfig,
  NgxUiLoaderHttpModule,
  NgxUiLoaderModule,
  NgxUiLoaderRouterModule
} from 'ngx-ui-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmVerfiyEmailComponent } from './auth/confirm-verfiy-email/confirm-verfiy-email.component';
import { EmailVerifyComponent } from './auth/email-verify/email-verify.component';
import { ErrorComponent } from './auth/error/error.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AboutComponent } from './pages/home-routes/about/about.component';
import { DebatesComponent } from './pages/home-routes/debates/debates.component';
import { HomeRoutesComponent } from './pages/home-routes/home-routes/home-routes.component';
import { HomeComponent } from './pages/home-routes/home/home.component';
import { UserDashboardComponent } from './pages/home-routes/user-dashboard/user-dashboard.component';
import { MyDebatesComponent } from './pages/home-routes/user-dashboard/my-debates/my-debates.component';
import { LikedDebatesComponent } from './pages/home-routes/user-dashboard/liked-debates/liked-debates.component';
import { DashboardComponent } from './pages/home-routes/user-dashboard/dashboard/dashboard.component';
import { CreateDebateComponent } from './pages/home-routes/user-dashboard/create-debate/create-debate.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsOpacity: 1,
  bgsPosition: 'bottom-right',
  bgsSize: 60,
  bgsType: 'ball-spin-clockwise-fade-rotating',
  blur: 6,
  fastFadeOut: true,
  fgsColor: '#ffffff',
  fgsPosition: 'center-center',
  fgsSize: 60,
  fgsType: 'ball-spin-clockwise',
  overlayBorderRadius: '0',
  overlayColor: 'rgba(40, 40, 40, 0.8)',
  pbColor: '#eb1515',
  pbDirection: 'ltr',
  pbThickness: 3,
  hasProgressBar: true,
};

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    DebatesComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ErrorComponent,
    EmailVerifyComponent,
    ConfirmVerfiyEmailComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    HomeRoutesComponent,
    MyDebatesComponent,
    LikedDebatesComponent,
    DashboardComponent,
    CreateDebateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule,
    NgxUiLoaderRouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
