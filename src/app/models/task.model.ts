export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  assignedTo: string;
  assignedBy: string;
  assignedDate: Date;
  dueDate: Date;
  status: TaskStatus;
  completedDate?: Date;
  priority: TaskPriority;
}

export enum TaskCategory {
  ISLAMIC_LEARNING = 'Islamic Learning',
  ACADEMIC_IMPROVEMENT = 'Academic Improvement',
  TECHNICAL_SKILLS = 'Technical Skills',
  LIFE_SKILLS = 'Life Skills'
}

export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  OVERDUE = 'Overdue'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export interface Person {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
}

export interface ProgressReport {
  personId: string;
  personName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  monthlyStats: MonthlyStats[];
}

export interface MonthlyStats {
  month: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}
