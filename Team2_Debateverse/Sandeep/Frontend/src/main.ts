import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';  // Import your standalone AppComponent
import { routes } from './app/app-routing.module';  // Import your routes
import { provideHttpClient } from '@angular/common/http';
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Provide the routes for your application
    provideHttpClient(),
  ],
})
  .catch((err) => console.error(err));
