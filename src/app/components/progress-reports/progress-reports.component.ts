import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

import { MockDataService } from '../../services/mock-data.service';
import { ProgressReport, Task, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-progress-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatTabsModule,
    MatChipsModule
  ],
  template: `
    <div class="progress-reports-container">
      <div class="header">
        <h1>Progress Reports</h1>
        <p>Track individual and overall progress</p>
      </div>

      <!-- Overall Summary -->
      <div class="overall-summary">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Overall Progress Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-stats">
              <div class="summary-item">
                <div class="summary-number">{{ totalTasks }}</div>
                <div class="summary-label">Total Tasks</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">{{ totalCompleted }}</div>
                <div class="summary-label">Completed</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">{{ overallCompletionRate | number:'1.0-0' }}%</div>
                <div class="summary-label">Completion Rate</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">{{ totalOverdue }}</div>
                <div class="summary-label">Overdue</div>
              </div>
            </div>
            <mat-progress-bar 
              [value]="overallCompletionRate" 
              [color]="overallCompletionRate > 70 ? 'primary' : overallCompletionRate > 40 ? 'accent' : 'warn'">
            </mat-progress-bar>
          </mat-card-content>
        </mat-card>
      </div>

             <!-- Individual Reports -->
       <div class="individual-reports">
         @for (report of progressReports; track report.personId) {
           <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>{{ report.personName }}</mat-card-title>
            <mat-card-subtitle>Progress Overview</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="report-content">
              <div class="progress-overview">
                <div class="completion-rate">
                  <div class="rate-circle" [ngClass]="getCompletionRateClass(report.completionRate)">
                    <span class="rate-number">{{ report.completionRate | number:'1.0-0' }}%</span>
                    <span class="rate-label">Complete</span>
                  </div>
                </div>
                
                <div class="task-stats">
                  <div class="stat-row">
                    <span class="stat-label">Total Tasks:</span>
                    <span class="stat-value">{{ report.totalTasks }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Completed:</span>
                    <span class="stat-value completed">{{ report.completedTasks }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Pending:</span>
                    <span class="stat-value pending">{{ report.pendingTasks }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Overdue:</span>
                    <span class="stat-value overdue">{{ report.overdueTasks }}</span>
                  </div>
                </div>
              </div>

              <div class="progress-bar-section">
                <div class="progress-item">
                  <span>Completion Progress</span>
                  <mat-progress-bar 
                    [value]="report.completionRate" 
                    [color]="report.completionRate > 70 ? 'primary' : report.completionRate > 40 ? 'accent' : 'warn'">
                  </mat-progress-bar>
                </div>
              </div>

                             <!-- Monthly Breakdown -->
               @if (report.monthlyStats.length > 0) {
                 <div class="monthly-breakdown">
                   <h4>Monthly Progress</h4>
                   <div class="monthly-stats">
                     @for (month of report.monthlyStats; track month.month) {
                       <div class="month-item">
                    <div class="month-header">
                      <span class="month-name">{{ formatMonth(month.month) }}</span>
                      <span class="month-rate">{{ month.completionRate | number:'1.0-0' }}%</span>
                    </div>
                    <mat-progress-bar 
                      [value]="month.completionRate" 
                      [color]="month.completionRate > 70 ? 'primary' : month.completionRate > 40 ? 'accent' : 'warn'">
                    </mat-progress-bar>
                    <div class="month-details">
                      <span>{{ month.completedTasks }}/{{ month.totalTasks }} tasks</span>
                    </div>
                  </div>
                 }
               </div>
            </div>
                }
              </div>
          </mat-card-content>
        </mat-card>
         }
       </div>

      <!-- Performance Comparison -->
      <div class="performance-comparison">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Performance Comparison</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="progressReports" class="comparison-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let report">{{ report.personName }}</td>
              </ng-container>

              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef>Total Tasks</th>
                <td mat-cell *matCellDef="let report">{{ report.totalTasks }}</td>
              </ng-container>

              <ng-container matColumnDef="completed">
                <th mat-header-cell *matHeaderCellDef>Completed</th>
                <td mat-cell *matCellDef="let report">{{ report.completedTasks }}</td>
              </ng-container>

              <ng-container matColumnDef="rate">
                <th mat-header-cell *matHeaderCellDef>Completion Rate</th>
                <td mat-cell *matCellDef="let report">
                  <div class="rate-cell">
                    <mat-progress-bar 
                      [value]="report.completionRate" 
                      [color]="report.completionRate > 70 ? 'primary' : report.completionRate > 40 ? 'accent' : 'warn'">
                    </mat-progress-bar>
                    <span>{{ report.completionRate | number:'1.0-0' }}%</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="overdue">
                <th mat-header-cell *matHeaderCellDef>Overdue</th>
                <td mat-cell *matCellDef="let report">
                  <mat-chip [ngClass]="report.overdueTasks > 0 ? 'overdue-chip' : 'no-overdue-chip'">
                    {{ report.overdueTasks }}
                  </mat-chip>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .progress-reports-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #1976d2;
      margin-bottom: 10px;
    }

    .header p {
      color: #666;
      font-size: 16px;
    }

    .overall-summary {
      margin-bottom: 30px;
    }

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .summary-item {
      text-align: center;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .summary-number {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
    }

    .summary-label {
      font-size: 0.875rem;
      color: #666;
      margin-top: 5px;
    }

    .individual-reports {
      margin-bottom: 30px;
    }

    .report-card {
      margin-bottom: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .report-content {
      padding: 20px 0;
    }

    .progress-overview {
      display: flex;
      align-items: center;
      gap: 30px;
      margin-bottom: 20px;
    }

    .completion-rate {
      flex-shrink: 0;
    }

    .rate-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .rate-circle.excellent {
      background: linear-gradient(135deg, #4caf50, #45a049);
    }

    .rate-circle.good {
      background: linear-gradient(135deg, #2196f3, #1976d2);
    }

    .rate-circle.average {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }

    .rate-circle.poor {
      background: linear-gradient(135deg, #f44336, #d32f2f);
    }

    .rate-number {
      font-size: 1.5rem;
      line-height: 1;
    }

    .rate-label {
      font-size: 0.75rem;
      opacity: 0.9;
    }

    .task-stats {
      flex-grow: 1;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .stat-row:last-child {
      border-bottom: none;
    }

    .stat-label {
      font-weight: 500;
      color: #333;
    }

    .stat-value {
      font-weight: bold;
    }

    .stat-value.completed {
      color: #4caf50;
    }

    .stat-value.pending {
      color: #ff9800;
    }

    .stat-value.overdue {
      color: #f44336;
    }

    .progress-bar-section {
      margin-bottom: 20px;
    }

    .progress-item span {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .monthly-breakdown h4 {
      margin-bottom: 15px;
      color: #333;
    }

    .monthly-stats {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .month-item {
      padding: 15px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .month-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .month-name {
      font-weight: 500;
      color: #333;
    }

    .month-rate {
      font-weight: bold;
      color: #1976d2;
    }

    .month-details {
      margin-top: 8px;
      font-size: 0.875rem;
      color: #666;
    }

    .performance-comparison {
      margin-bottom: 30px;
    }

    .comparison-table {
      width: 100%;
    }

    .rate-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .rate-cell mat-progress-bar {
      flex-grow: 1;
    }

    .overdue-chip {
      background-color: #f44336 !important;
      color: white !important;
    }

    .no-overdue-chip {
      background-color: #4caf50 !important;
      color: white !important;
    }

    @media (max-width: 768px) {
      .progress-reports-container {
        padding: 10px;
      }

      .progress-overview {
        flex-direction: column;
        text-align: center;
      }

      .summary-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .rate-circle {
        width: 100px;
        height: 100px;
      }

      .rate-number {
        font-size: 1.25rem;
      }

      .comparison-table {
        font-size: 0.875rem;
      }
    }
  `]
})
export class ProgressReportsComponent implements OnInit {
  progressReports: ProgressReport[] = [];
  totalTasks = 0;
  totalCompleted = 0;
  totalOverdue = 0;
  overallCompletionRate = 0;

  displayedColumns: string[] = ['name', 'total', 'completed', 'rate', 'overdue'];

  constructor(private mockDataService: MockDataService) { }

  ngOnInit(): void {
    this.loadProgressReports();
  }

  loadProgressReports(): void {
    this.mockDataService.getAllProgressReports().subscribe(reports => {
      this.progressReports = reports;
      this.calculateOverallStats();
    });
  }

  calculateOverallStats(): void {
    this.totalTasks = this.progressReports.reduce((sum, report) => sum + report.totalTasks, 0);
    this.totalCompleted = this.progressReports.reduce((sum, report) => sum + report.completedTasks, 0);
    this.totalOverdue = this.progressReports.reduce((sum, report) => sum + report.overdueTasks, 0);
    this.overallCompletionRate = this.totalTasks > 0 ? (this.totalCompleted / this.totalTasks) * 100 : 0;
  }

  getCompletionRateClass(rate: number): string {
    if (rate >= 80) return 'excellent';
    if (rate >= 60) return 'good';
    if (rate >= 40) return 'average';
    return 'poor';
  }

  formatMonth(monthString: string): string {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
}
