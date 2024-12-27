import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // For ngModel
import { CommonModule } from '@angular/common'; // For *ngFor and *ngIf
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, // Import FormsModule for ngModel
    CommonModule, // Import CommonModule for *ngFor and other structural directives
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
