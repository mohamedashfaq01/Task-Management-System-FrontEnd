import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { ProgressReportsComponent } from './components/progress-reports/progress-reports.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'create-task', component: CreateTaskComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'progress-reports', component: ProgressReportsComponent },
  { path: '**', redirectTo: '' }
];
