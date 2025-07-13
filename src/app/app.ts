import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard/dashboard';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DashboardComponent,
    NgChartsModule  // ✅ Make sure this is here
  ],
  templateUrl: './app.html'
})
export class AppComponent {}