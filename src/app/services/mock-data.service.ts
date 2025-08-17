import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Task, TaskCategory, TaskStatus, TaskPriority, Person, ProgressReport } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Memorize Surah Al-Fatiha',
      description: 'Complete memorization of Surah Al-Fatiha with proper tajweed',
      category: TaskCategory.ISLAMIC_LEARNING,
      assignedTo: '1',
      assignedBy: 'admin',
      assignedDate: new Date('2024-01-01'),
      dueDate: new Date('2024-01-31'),
      status: TaskStatus.COMPLETED,
      completedDate: new Date('2024-01-25'),
      priority: TaskPriority.HIGH
    },
    {
      id: '2',
      title: 'Learn React Hooks',
      description: 'Study and practice React Hooks (useState, useEffect, useContext)',
      category: TaskCategory.TECHNICAL_SKILLS,
      assignedTo: '2',
      assignedBy: 'admin',
      assignedDate: new Date('2024-01-01'),
      dueDate: new Date('2024-01-31'),
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM
    },
    {
      id: '3',
      title: 'Complete Math Chapter 5',
      description: 'Finish exercises and problems from Chapter 5 of Mathematics textbook',
      category: TaskCategory.ACADEMIC_IMPROVEMENT,
      assignedTo: '1',
      assignedBy: 'admin',
      assignedDate: new Date('2024-01-01'),
      dueDate: new Date('2024-01-15'),
      status: TaskStatus.OVERDUE,
      priority: TaskPriority.HIGH
    },
    {
      id: '4',
      title: 'Help with Kitchen Cleaning',
      description: 'Assist in cleaning kitchen and organizing utensils',
      category: TaskCategory.LIFE_SKILLS,
      assignedTo: '3',
      assignedBy: 'admin',
      assignedDate: new Date('2024-01-01'),
      dueDate: new Date('2024-01-10'),
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: '5',
      title: 'Read Hadith Collection',
      description: 'Read and understand 10 hadiths from Sahih Bukhari',
      category: TaskCategory.ISLAMIC_LEARNING,
      assignedTo: '2',
      assignedBy: 'admin',
      assignedDate: new Date('2024-01-01'),
      dueDate: new Date('2024-01-20'),
      status: TaskStatus.COMPLETED,
      completedDate: new Date('2024-01-18'),
      priority: TaskPriority.MEDIUM
    }
  ];

  private people: Person[] = [
    {
      id: '1',
      name: 'Ahmed Khan',
      phone: '+1234567890',
      email: 'ahmed@example.com',
      avatar: 'assets/avatars/ahmed.svg'
    },
    {
      id: '2',
      name: 'Fatima Ali',
      phone: '+1234567891',
      email: 'fatima@example.com',
      avatar: 'assets/avatars/fatima.jpg'
    },
    {
      id: '3',
      name: 'Omar Hassan',
      phone: '+1234567892',
      email: 'omar@example.com',
      avatar: 'assets/avatars/omar.jpg'
    }
  ];

  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);

  constructor() {}

  // Task methods
  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getTasksByPerson(personId: string): Observable<Task[]> {
    const personTasks = this.tasks.filter(task => task.assignedTo === personId);
    return of(personTasks);
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: (this.tasks.length + 1).toString(),
      status: TaskStatus.PENDING
    };
    this.tasks.push(newTask);
    this.tasksSubject.next([...this.tasks]);
    
    // Simulate SMS notification
    this.simulateSMSNotification(newTask, 'task_created');
    
    return of(newTask);
  }

  updateTaskStatus(taskId: string, status: TaskStatus): Observable<Task> {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].status = status;
      if (status === TaskStatus.COMPLETED) {
        this.tasks[taskIndex].completedDate = new Date();
        // Simulate SMS notification for completion
        this.simulateSMSNotification(this.tasks[taskIndex], 'task_completed');
      }
      this.tasksSubject.next([...this.tasks]);
      return of(this.tasks[taskIndex]);
    }
    return of(null as any);
  }

  // Person methods
  getPeople(): Observable<Person[]> {
    return of(this.people);
  }

  getPersonById(id: string): Observable<Person | undefined> {
    return of(this.people.find(person => person.id === id));
  }

  // Category methods
  getCategories(): Observable<TaskCategory[]> {
    return of(Object.values(TaskCategory));
  }

  // Progress report methods
  getProgressReport(personId: string): Observable<ProgressReport> {
    const person = this.people.find(p => p.id === personId);
    const personTasks = this.tasks.filter(task => task.assignedTo === personId);
    
    const totalTasks = personTasks.length;
    const completedTasks = personTasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const pendingTasks = personTasks.filter(task => task.status === TaskStatus.PENDING).length;
    const overdueTasks = personTasks.filter(task => task.status === TaskStatus.OVERDUE).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const monthlyStats = this.calculateMonthlyStats(personTasks);

    const report: ProgressReport = {
      personId,
      personName: person?.name || 'Unknown',
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate,
      monthlyStats
    };

    return of(report);
  }

  getAllProgressReports(): Observable<ProgressReport[]> {
    const reports: ProgressReport[] = [];
    this.people.forEach(person => {
      this.getProgressReport(person.id).subscribe(report => {
        reports.push(report);
      });
    });
    return of(reports);
  }

  private calculateMonthlyStats(tasks: Task[]): any[] {
    const monthlyData: { [key: string]: { total: number; completed: number } } = {};
    
    tasks.forEach(task => {
      const month = task.assignedDate.toISOString().substring(0, 7); // YYYY-MM format
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, completed: 0 };
      }
      monthlyData[month].total++;
      if (task.status === TaskStatus.COMPLETED) {
        monthlyData[month].completed++;
      }
    });

    return Object.keys(monthlyData).map(month => ({
      month,
      totalTasks: monthlyData[month].total,
      completedTasks: monthlyData[month].completed,
      completionRate: (monthlyData[month].completed / monthlyData[month].total) * 100
    }));
  }

  private simulateSMSNotification(task: Task, type: 'task_created' | 'task_completed'): void {
    const person = this.people.find(p => p.id === task.assignedTo);
    const creator = this.people.find(p => p.id === task.assignedBy) || { name: 'Admin' };
    
    if (type === 'task_created') {
      console.log(`📱 SMS to ${person?.name} (${person?.phone}): New task assigned: "${task.title}" due ${task.dueDate.toLocaleDateString()}`);
    } else if (type === 'task_completed') {
      console.log(`📱 SMS to ${creator.name}: Task "${task.title}" has been completed by ${person?.name}!`);
    }
  }
}
