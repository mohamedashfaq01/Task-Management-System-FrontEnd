import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MockDataService } from '../../services/mock-data.service';
import { Task, TaskCategory, TaskPriority, Person } from '../../models/task.model';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <div class="form-container fade-in">
      <div class="header">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="form-title">Create New Task</h1>
      </div>

      <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
            <div class="form-full-width">
              <mat-form-field appearance="outline">
                <mat-label>Task Title</mat-label>
                <input matInput formControlName="title" placeholder="Enter task title">
                @if (taskForm.get('title')?.hasError('required')) {
                  <mat-error>
                  Task title is required
                </mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-full-width">
              <mat-form-field appearance="outline">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="4" placeholder="Enter task description"></textarea>
                @if (taskForm.get('description')?.hasError('required')) {
                  <mat-error>   
                     Description is required
                </mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select formControlName="category">
                  @for (category of categories; track category) {
                    <mat-option [value]="category">
                      {{ category }}
                    </mat-option>
                  }
                </mat-select>
                @if (taskForm.get('category')?.hasError('required')) {
                  <mat-error>   
                  Category is required
                </mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Priority</mat-label>
                <mat-select formControlName="priority">
                  @for (priority of priorities; track priority) {
                    <mat-option [value]="priority">
                      {{ priority }}
                    </mat-option>
                  }
                </mat-select>
                @if (taskForm.get('priority')?.hasError('required')) {
                  <mat-error>   
                  Priority is required
                </mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Assign To</mat-label>
                <mat-select formControlName="assignedTo">
                  @for (person of people; track person.id) {
                    <mat-option [value]="person.id">
                      {{ person.name }}
                    </mat-option>
                  }
                </mat-select>
                @if (taskForm.get('assignedTo')?.hasError('required')) {
                  <mat-error>   
                  Please select a person
                </mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Due Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="dueDate" placeholder="Choose a date">
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                @if (taskForm.get('dueDate')?.hasError('required')) {
                  <mat-error>   
                  Due date is required
                </mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">
                Cancel
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid || isSubmitting" class="submit-button">
              @if (isSubmitting) {
                <mat-icon>hourglass_empty</mat-icon>
              }
                {{ isSubmitting ? 'Creating...' : 'Create Task' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

             <!-- Task Preview -->
       @if (taskForm.valid) {
         <mat-card class="preview-card">
        <mat-card-header>
          <mat-card-title>Task Preview</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="preview-content">
            <div class="preview-item">
              <strong>Title:</strong> {{ taskForm.get('title')?.value }}
            </div>
            <div class="preview-item">
              <strong>Description:</strong> {{ taskForm.get('description')?.value }}
            </div>
            <div class="preview-item">
              <strong>Category:</strong> {{ taskForm.get('category')?.value }}
            </div>
            <div class="preview-item">
              <strong>Priority:</strong> 
              <span class="priority-badge priority-{{ taskForm.get('priority')?.value?.toLowerCase() }}">
                {{ taskForm.get('priority')?.value }}
              </span>
            </div>
            <div class="preview-item">
              <strong>Assigned To:</strong> {{ getPersonName(taskForm.get('assignedTo')?.value) }}
            </div>
            <div class="preview-item">
              <strong>Due Date:</strong> {{ taskForm.get('dueDate')?.value | date:'mediumDate' }}
            </div>
          </div>
        </mat-card-content>
      </mat-card>
       }
    </div>
  `,
  styles: [`
    .create-task-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #1976d2;
      margin: 0;
    }

    .task-form-card {
      margin-bottom: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .form-row {
      margin-bottom: 20px;
    }

    .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
    }

    .preview-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .preview-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .preview-item {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .preview-item:last-child {
      border-bottom: none;
    }

    .priority-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      color: white;
    }

    .priority-low {
      background-color: #4caf50;
    }

    .priority-medium {
      background-color: #ff9800;
    }

    .priority-high {
      background-color: #f44336;
    }

    .priority-urgent {
      background-color: #9c27b0;
    }

    @media (max-width: 768px) {
      .create-task-container {
        padding: 10px;
      }

      .two-columns {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class CreateTaskComponent implements OnInit {
  taskForm: FormGroup;
  categories: TaskCategory[] = [];
  priorities: TaskPriority[] = [];
  people: Person[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private mockDataService: MockDataService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      priority: [TaskPriority.MEDIUM, Validators.required],
      assignedTo: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFormData();
  }

  loadFormData(): void {
    // Load categories
    this.mockDataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    // Load people
    this.mockDataService.getPeople().subscribe(people => {
      this.people = people;
    });

    // Set priorities
    this.priorities = Object.values(TaskPriority);
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isSubmitting = true;

      const taskData = {
        ...this.taskForm.value,
        assignedBy: 'admin',
        assignedDate: new Date()
      };

      this.mockDataService.createTask(taskData).subscribe({
        next: (task) => {
          this.isSubmitting = false;
          this.snackBar.open('Task created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Error creating task. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  getPersonName(personId: string): string {
    const person = this.people.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
