import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule if using ngModel

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // Add FormsModule if needed
  ],
  providers: [],
  bootstrap: [],  // No need to bootstrap AppComponent here
})
export class AppModule {}
