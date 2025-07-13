import { Component, OnInit, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  dashboardService = inject(DashboardService);

  totalShipments = 0;
  pickedButNotShipped = 0;
  notPicked = 0;
  inProgress = 0;
  delayed = 0;
  delivered = 0;

  currentPeriod: string = 'day';
  hourlyLabels: string[] = [];
  hourlyData: number[] = [];

  lineChartInstance: any;
  doughnutChartInstance: any;

  ngOnInit() {
    this.loadData(this.currentPeriod);
  }

  onPeriodChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.currentPeriod = value;
    this.loadData(this.currentPeriod);
  }

  loadData(period: string) {
    this.dashboardService.getSummary(period).subscribe(summary => {
      this.totalShipments = summary.totalShipments ?? 0;
      this.pickedButNotShipped = summary.pickedButNotShipped ?? 0;
      this.notPicked = summary.notPicked ?? 0;
      this.inProgress = summary.inProgress ?? 0;
      this.delayed = summary.delayed ?? 0;
      this.delivered = summary.delivered ?? 0;
      this.renderDoughnutChart();
    });

    this.dashboardService.getVolumeByPeriod(period).subscribe(volumeData => {
  const data = volumeData ?? {};
  //this.hourlyLabels = Object.keys(data);
  this.hourlyData = Object.values(data);
  this.hourlyLabels = Object.keys(data).map(key => this.formatLabelByPeriod(+key));
  this.renderBarChart();
});
  }

  renderBarChart() {
    if (this.lineChartInstance) {
      this.lineChartInstance.destroy();
    }

    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    this.lineChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.hourlyLabels,
        datasets: [{
          label: this.getChartLabelByPeriod(),
          data: this.hourlyData,
          backgroundColor: '#facc15'
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#facc15' } }
        },
        scales: {
          x: { ticks: { color: '#facc15' } },
          y: { ticks: { color: '#facc15' } }
        }
      }
    });
  }

  renderDoughnutChart() {
    if (this.doughnutChartInstance) {
      this.doughnutChartInstance.destroy();
    }

    const ctx = document.getElementById('doughnutChart') as HTMLCanvasElement;
    this.doughnutChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Delivered', 'In Progress', 'Not Picked', 'Delayed'],
        datasets: [{
          data: [
            this.delivered,
            this.inProgress,
            this.notPicked,
            this.delayed
          ],
          backgroundColor: ['#34d399', '#fbbf24', '#f87171', '#f43f5e']
        }]
      },
      options: {
        plugins: {
          legend: { labels: { color: '#facc15' } }
        }
      }
    });
  }

  getChartLabelByPeriod(): string {
    switch (this.currentPeriod) {
      case 'month': return 'Shipments Per Day';
      case 'year': return 'Shipments Per Month';
      default: return 'Hourly Shipments';
    }
  }

  formatLabelByPeriod(value: number): string {
  const period = this.currentPeriod;
  if (period === 'day') {
    const hour = value % 24;
    const periodLabel = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour} ${periodLabel}`;
}

  if (period === 'month') {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), value);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // e.g., "Jul 12"
  }

  if (period === 'year') {
    return new Date(0, value - 1).toLocaleString('en-US', { month: 'short' }); // "Jan", "Feb"
  }

  return value.toString();
}
  
}
