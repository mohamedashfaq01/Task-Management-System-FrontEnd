import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { MockDataService } from '../../services/mock-data.service';
import { Task, TaskStatus, Person, ProgressReport } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatListModule,
    MatDividerModule
  ],
  template: `
    <div class="dashboard-container fade-in">
      <div class="header">
        <h1>Task Tracker Dashboard</h1>
        <p>Track and manage tasks for your family members</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">assignment</mat-icon>
            <div class="stat-details">
              <div class="stat-number">{{ totalTasks }}</div>
              <div class="stat-label">Total Tasks</div>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">check_circle</mat-icon>
            <div class="stat-details">
              <div class="stat-number">{{ completedTasks }}</div>
              <div class="stat-label">Completed</div>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">pending</mat-icon>
            <div class="stat-details">
              <div class="stat-number">{{ pendingTasks }}</div>
              <div class="stat-label">Pending</div>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <mat-icon class="stat-icon">warning</mat-icon>
            <div class="stat-details">
              <div class="stat-number">{{ overdueTasks }}</div>
              <div class="stat-label">Overdue</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="actions-section">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button mat-raised-button color="primary" routerLink="/create-task">
            <mat-icon>add</mat-icon>
            Create New Task
          </button>
          <button mat-raised-button color="accent" routerLink="/progress-reports">
            <mat-icon>analytics</mat-icon>
            View Progress Reports
          </button>
          <button mat-raised-button routerLink="/tasks">
            <mat-icon>list</mat-icon>
            View All Tasks
          </button>
        </div>
      </div>

      <!-- Recent Tasks -->
      <div class="recent-tasks">
        <h2>Recent Tasks</h2>
        <mat-card>
          <mat-card-content>
            <mat-list>
                             @for (task of recentTasks; track task.id) {
                 <mat-list-item class="task-item">
                   <div class="task-content">
                     <div class="task-info">
                       <h4>{{ task.title }}</h4>
                       <p>{{ task.description }}</p>
                       <div class="task-meta">
                         <span class="assigned-to">Assigned to: {{ getPersonName(task.assignedTo) }}</span>
                         <span class="due-date">Due: {{ task.dueDate | date:'shortDate' }}</span>
                       </div>
                     </div>
                     <div class="task-status">
                       <mat-chip [ngClass]="getStatusClass(task.status)">
                         {{ task.status }}
                       </mat-chip>
                     </div>
                   </div>
                 </mat-list-item>
               }
            </mat-list>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Progress Overview -->
      <div class="progress-overview">
        <h2>Progress Overview</h2>
                 <div class="progress-cards">
           @for (report of progressReports; track report.personId) {
             <mat-card class="progress-card">
               <mat-card-header>
                 <mat-card-title>{{ report.personName }}</mat-card-title>
               </mat-card-header>
               <mat-card-content>
                 <div class="progress-stats">
                   <div class="progress-item">
                     <span>Completion Rate</span>
                     <mat-progress-bar 
                       [value]="report.completionRate" 
                       [color]="report.completionRate > 70 ? 'primary' : report.completionRate > 40 ? 'accent' : 'warn'">
                     </mat-progress-bar>
                     <span>{{ report.completionRate | number:'1.0-0' }}%</span>
                   </div>
                   <div class="progress-numbers">
                     <div class="stat">
                       <span class="number">{{ report.completedTasks }}</span>
                       <span class="label">Completed</span>
                     </div>
                     <div class="stat">
                       <span class="number">{{ report.pendingTasks }}</span>
                       <span class="label">Pending</span>
                     </div>
                     <div class="stat">
                       <span class="number">{{ report.overdueTasks }}</span>
                       <span class="label">Overdue</span>
                     </div>
                   </div>
                 </div>
               </mat-card-content>
             </mat-card>
           }
         </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
    }

    .stat-icon {
      font-size: 3rem;
      width: 29rem;
      height: 3rem;
      color: white;
      opacity: 0.8;
    }

    .stat-details {
      flex-grow: 1;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 8px;
      line-height: 1;
    }

    .stat-label {
      font-size: 1rem;
      color: white;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .actions-section {
      margin-bottom: 30px;
    }

    .actions-section h2 {
      color: #333;
      margin-bottom: 15px;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
    }

    .recent-tasks, .progress-overview {
      margin-bottom: 30px;
    }

    .recent-tasks h2, .progress-overview h2 {
      color: #333;
      margin-bottom: 15px;
    }

    .task-item {
      border-bottom: 1px solid #eee;
    }

    .task-item:last-child {
      border-bottom: none;
    }

    .task-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .task-info h4 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .task-info p {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
    }

    .task-meta {
      display: flex;
      gap: 20px;
      font-size: 12px;
      color: #888;
    }

    .task-status mat-chip {
      font-weight: 500;
    }

    .status-pending {
      background-color: #ff9800 !important;
      color: white !important;
    }

    .status-in-progress {
      background-color: #2196f3 !important;
      color: white !important;
    }

    .status-completed {
      background-color: #4caf50 !important;
      color: white !important;
    }

    .status-overdue {
      background-color: #f44336 !important;
      color: white !important;
    }

    .progress-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .progress-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .progress-stats {
      padding: 10px 0;
    }

    .progress-item {
      margin-bottom: 20px;
    }

    .progress-item span {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    .progress-item mat-progress-bar {
      margin: 10px 0;
    }

    .progress-numbers {
      display: flex;
      justify-content: space-around;
      text-align: center;
    }

    .stat .number {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      color: #1976d2;
    }

    .stat .label {
      font-size: 0.875rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 10px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .action-buttons {
        flex-direction: column;
      }

      .progress-cards {
        grid-template-columns: 1fr;
      }

      .task-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  people: Person[] = [];
  progressReports: ProgressReport[] = [];
  
  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  overdueTasks = 0;
  recentTasks: Task[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load tasks
    this.mockDataService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.calculateStats();
      this.recentTasks = tasks.slice(0, 5); // Get 5 most recent tasks
    });

    // Load people
    this.mockDataService.getPeople().subscribe(people => {
      this.people = people;
    });

    // Load progress reports
    this.mockDataService.getAllProgressReports().subscribe(reports => {
      this.progressReports = reports;
    });
  }

  calculateStats(): void {
    this.totalTasks = this.tasks.length;
    this.completedTasks = this.tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    this.pendingTasks = this.tasks.filter(task => task.status === TaskStatus.PENDING).length;
    this.overdueTasks = this.tasks.filter(task => task.status === TaskStatus.OVERDUE).length;
  }

  getPersonName(personId: string): string {
    const person = this.people.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  }

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING:
        return 'status-pending';
      case TaskStatus.IN_PROGRESS:
        return 'status-in-progress';
      case TaskStatus.COMPLETED:
        return 'status-completed';
      case TaskStatus.OVERDUE:
        return 'status-overdue';
      default:
        return '';
    }
  }
}
