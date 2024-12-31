import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import {
  NgxUiLoaderConfig,
  NgxUiLoaderHttpModule,
  NgxUiLoaderModule,
  NgxUiLoaderRouterModule,
} from 'ngx-ui-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmailVerifyComponent } from './auth/email-verify/email-verify.component';
import { ErrorComponent } from './auth/error/error.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { authInterceptor } from './interceptors/auth/auth.interceptor';
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
    UserDashboardComponent,
    HomeRoutesComponent,
    MyDebatesComponent,
    LikedDebatesComponent,
    DashboardComponent,
    CreateDebateComponent,
    DebatePollComponent,
    AdminDashboardComponent,
    AllDebatesComponent,
    UsersComponent,
    DebateUpdateComponent,
    PagenotfoundComponent,
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
    MatCardModule,
    MatIconModule,
    CanvasJSAngularChartsModule,
    MatPaginatorModule,
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [AppComponent],
})
export class AppModule {}
