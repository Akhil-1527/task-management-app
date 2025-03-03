import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';
  
  // For local development without a backend
  private localTasks: Task[] = [
    {
      id: 1,
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the task management application',
      dueDate: new Date('2025-03-15'),
      priority: 'high',
      status: 'todo',
      createdAt: new Date('2025-02-25')
    },
    {
      id: 2,
      title: 'Fix UI bugs',
      description: 'Address responsive design issues on mobile devices',
      dueDate: new Date('2025-03-10'),
      priority: 'medium',
      status: 'in-progress',
      createdAt: new Date('2025-02-20')
    },
    {
      id: 3,
      title: 'Update dependencies',
      description: 'Update all npm packages to their latest versions',
      dueDate: new Date('2025-03-05'),
      priority: 'low',
      status: 'completed',
      createdAt: new Date('2025-02-15')
    }
  ];
  private useLocalStorage = true;

  constructor(private http: HttpClient) {
    // Initialize local storage if needed
    if (this.useLocalStorage && !localStorage.getItem('tasks')) {
      localStorage.setItem('tasks', JSON.stringify(this.localTasks));
    }
  }

  getTasks(): Observable<Task[]> {
    if (this.useLocalStorage) {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      return of(tasks);
    }
    
    return this.http.get<Task[]>(this.apiUrl).pipe(
      catchError(this.handleError<Task[]>('getTasks', []))
    );
  }

  getTask(id: number): Observable<Task> {
    if (this.useLocalStorage) {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const task = tasks.find((t: Task) => t.id === id);
      return of(task);
    }
    
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<Task>(`getTask id=${id}`))
    );
  }

  createTask(task: Task): Observable<Task> {
    if (this.useLocalStorage) {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const newId = tasks.length > 0 ? Math.max(...tasks.map((t: Task) => t.id || 0)) + 1 : 1;
      const newTask = { ...task, id: newId };
      tasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return of(newTask);
    }
    
    return this.http.post<Task>(this.apiUrl, task).pipe(
      catchError(this.handleError<Task>('createTask'))
    );
  }

  updateTask(task: Task): Observable<Task> {
    if (this.useLocalStorage) {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const index = tasks.findIndex((t: Task) => t.id === task.id);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...task };
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
      return of(task);
    }
    
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task).pipe(
      catchError(this.handleError<Task>('updateTask'))
    );
  }

  deleteTask(id: number): Observable<void> {
    if (this.useLocalStorage) {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const filteredTasks = tasks.filter((t: Task) => t.id !== id);
      localStorage.setItem('tasks', JSON.stringify(filteredTasks));
      return of(undefined);
    }
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<void>('deleteTask'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}