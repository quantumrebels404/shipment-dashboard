import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  // Fetch summary card values
  getSummary(period: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/summary?period=${period}`);
  }

  // 📊 Fetch chart data from the correct endpoint
  getVolumeByPeriod(period: string): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.baseUrl}/volume?period=${period}`);
  }
}
