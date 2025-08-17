import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

import { MockDataService } from '../../services/mock-data.service';
import { Task, TaskStatus, TaskCategory, Person } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <div class="task-list-container">
      <div class="header">
        <h1>All Tasks</h1>
        <p>Manage and track all assigned tasks</p>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <mat-card>
          <mat-card-content>
            <div class="filters-grid">
              <mat-form-field appearance="outline">
                <mat-label>Search Tasks</mat-label>
                <input matInput [(ngModel)]="searchTerm" placeholder="Search by title or description">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Filter by Status</mat-label>
                                 <mat-select [(ngModel)]="statusFilter">
                   <mat-option value="">All Statuses</mat-option>
                   @for (status of statuses; track status) {
                     <mat-option [value]="status">
                       {{ status }}
                     </mat-option>
                   }
                 </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Filter by Category</mat-label>
                                 <mat-select [(ngModel)]="categoryFilter">
                   <mat-option value="">All Categories</mat-option>
                   @for (category of categories; track category) {
                     <mat-option [value]="category">
                       {{ category }}
                     </mat-option>
                   }
                 </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Filter by Person</mat-label>
                                 <mat-select [(ngModel)]="personFilter">
                   <mat-option value="">All People</mat-option>
                   @for (person of people; track person.id) {
                     <mat-option [value]="person.id">
                       {{ person.name }}
                     </mat-option>
                   }
                 </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Task Stats -->
      <div class="task-stats">
        <div class="stat-item">
          <span class="stat-number">{{ filteredTasks.length }}</span>
          <span class="stat-label">Total Tasks</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ getTasksByStatus(TaskStatus.PENDING).length }}</span>
          <span class="stat-label">Pending</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ getTasksByStatus(TaskStatus.IN_PROGRESS).length }}</span>
          <span class="stat-label">In Progress</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ getTasksByStatus(TaskStatus.COMPLETED).length }}</span>
          <span class="stat-label">Completed</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ getTasksByStatus(TaskStatus.OVERDUE).length }}</span>
          <span class="stat-label">Overdue</span>
        </div>
      </div>

             <!-- Task List -->
       <div class="tasks-grid">
         @for (task of filteredTasks; track task.id) {
           <mat-card class="task-card" [ngClass]="getTaskCardClass(task)">
          <mat-card-header>
            <mat-card-title>{{ task.title }}</mat-card-title>
            <mat-card-subtitle>
              Assigned to {{ getPersonName(task.assignedTo) }}
            </mat-card-subtitle>
            <div class="task-actions">
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                                 @if (task.status !== TaskStatus.PENDING) {
                   <button mat-menu-item (click)="updateTaskStatus(task.id, TaskStatus.PENDING)">
                     <mat-icon>pending</mat-icon>
                     Mark as Pending
                   </button>
                 }
                 @if (task.status !== TaskStatus.IN_PROGRESS) {
                   <button mat-menu-item (click)="updateTaskStatus(task.id, TaskStatus.IN_PROGRESS)">
                     <mat-icon>play_arrow</mat-icon>
                     Mark as In Progress
                   </button>
                 }
                 @if (task.status !== TaskStatus.COMPLETED) {
                   <button mat-menu-item (click)="updateTaskStatus(task.id, TaskStatus.COMPLETED)">
                     <mat-icon>check_circle</mat-icon>
                     Mark as Completed
                   </button>
                 }
              </mat-menu>
            </div>
          </mat-card-header>

          <mat-card-content>
            <p class="task-description">{{ task.description }}</p>
            
            <div class="task-meta">
              <div class="meta-item">
                <mat-icon>category</mat-icon>
                <span>{{ task.category }}</span>
              </div>
              <div class="meta-item">
                <mat-icon>schedule</mat-icon>
                <span>Due: {{ task.dueDate | date:'shortDate' }}</span>
              </div>
                             @if (task.completedDate) {
                 <div class="meta-item">
                   <mat-icon>check_circle</mat-icon>
                   <span>Completed: {{ task.completedDate | date:'shortDate' }}</span>
                 </div>
               }
            </div>

            <div class="task-tags">
              <mat-chip [ngClass]="getStatusClass(task.status)">
                {{ task.status }}
              </mat-chip>
              <mat-chip [ngClass]="getPriorityClass(task.priority)">
                {{ task.priority }}
              </mat-chip>
            </div>
          </mat-card-content>
        </mat-card>
         }
       </div>

      <!-- Empty State -->
      @if (filteredTasks.length === 0) {
        <div class="empty-state">
        <mat-icon>assignment</mat-icon>
        <h3>No tasks found</h3>
        <p>Try adjusting your filters or create a new task</p>
        </div>
       }
    </div>
  `,
  styles: [`
    .task-list-container {
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

    .filters-section {
      margin-bottom: 30px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .task-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }

    .stat-item {
      text-align: center;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
      min-width: 100px;
    }

    .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      color: #1976d2;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .task-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .task-card.overdue {
      border-left: 4px solid #f44336;
    }

    .task-card.completed {
      border-left: 4px solid #4caf50;
      opacity: 0.8;
    }

    .task-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .task-actions {
      margin-left: auto;
    }

    .task-description {
      color: #666;
      margin: 15px 0;
      line-height: 1.5;
    }

    .task-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 15px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }

    .meta-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .task-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
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

    .priority-low {
      background-color: #4caf50 !important;
      color: white !important;
    }

    .priority-medium {
      background-color: #ff9800 !important;
      color: white !important;
    }

    .priority-high {
      background-color: #f44336 !important;
      color: white !important;
    }

    .priority-urgent {
      background-color: #9c27b0 !important;
      color: white !important;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      margin-bottom: 10px;
      color: #333;
    }

    @media (max-width: 768px) {
      .task-list-container {
        padding: 10px;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .tasks-grid {
        grid-template-columns: 1fr;
      }

      .task-stats {
        flex-direction: column;
        align-items: center;
      }

      .stat-item {
        width: 100%;
        max-width: 200px;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  people: Person[] = [];
  categories: TaskCategory[] = [];
  statuses = Object.values(TaskStatus);
  
  searchTerm = '';
  statusFilter = '';
  categoryFilter = '';
  personFilter = '';

  TaskStatus = TaskStatus; // Make enum available in template

  constructor(
    private mockDataService: MockDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.mockDataService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });

    this.mockDataService.getPeople().subscribe(people => {
      this.people = people;
    });

    this.mockDataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  get filteredTasks(): Task[] {
    return this.tasks.filter(task => {
      const matchesSearch = !this.searchTerm || 
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || task.status === this.statusFilter;
      const matchesCategory = !this.categoryFilter || task.category === this.categoryFilter;
      const matchesPerson = !this.personFilter || task.assignedTo === this.personFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPerson;
    });
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  getPersonName(personId: string): string {
    const person = this.people.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus): void {
    this.mockDataService.updateTaskStatus(taskId, newStatus).subscribe({
      next: (task) => {
        this.snackBar.open(`Task status updated to ${newStatus}`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.snackBar.open('Error updating task status', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
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

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low':
        return 'priority-low';
      case 'Medium':
        return 'priority-medium';
      case 'High':
        return 'priority-high';
      case 'Urgent':
        return 'priority-urgent';
      default:
        return '';
    }
  }

  getTaskCardClass(task: Task): string {
    const classes = [];
    if (task.status === TaskStatus.OVERDUE) {
      classes.push('overdue');
    }
    if (task.status === TaskStatus.COMPLETED) {
      classes.push('completed');
    }
    return classes.join(' ');
  }
}
