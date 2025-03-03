import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  statusFilter: string = 'all';
  priorityFilter: string = 'all';
  sortOption: string = 'dueDate';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';
  isLoading: boolean = true;

  constructor(private taskService: TaskService) {}

  /**
   * Initialize component and load tasks
   */
  ngOnInit(): void {
    this.loadTasks();
  }

  /**
   * Fetch tasks from service and apply filters
   */
  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  /**
   * Apply all active filters and sorting
   */
  applyFilters(): void {
    this.filteredTasks = [...this.tasks];

    if (this.statusFilter !== 'all') {
      this.filteredTasks = this.filteredTasks.filter(task => task.status === this.statusFilter);
    }

    if (this.priorityFilter !== 'all') {
      this.filteredTasks = this.filteredTasks.filter(task => task.priority === this.priorityFilter);
    }

    if (this.searchTerm.trim() !== '') {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredTasks = this.filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) || 
        task.description.toLowerCase().includes(searchLower)
      );
    }

    this.sortTasks();
  }

  /**
   * Sort tasks based on selected criteria
   */
  sortTasks(): void {
    this.filteredTasks.sort((a, b) => {
      let comparison = 0;
      const aDate = new Date(a.dueDate ?? new Date()).getTime();
      const bDate = new Date(b.dueDate ?? new Date()).getTime();

      switch (this.sortOption) {
        case 'dueDate':
          comparison = aDate - bDate;
          break;
        case 'priority':
          const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          const aCreated = new Date(a.createdAt ?? new Date()).getTime();
          const bCreated = new Date(b.createdAt ?? new Date()).getTime();
          comparison = aCreated - bCreated;
          break;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Toggle sort direction when the same option is clicked
   */
  toggleSort(option: string): void {
    if (this.sortOption === option) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOption = option;
      this.sortDirection = 'asc';
    }
    this.sortTasks();
  }

  /**
   * Delete task with confirmation
   */
  deleteTask(id?: number): void {
    if (!id) {
      console.error('Task ID is undefined. Cannot delete task.');
      return;
    }

    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
    }
  }

  /**
   * Update task status
   */
  updateTaskStatus(task: Task, status: string): void {
    const updatedTask = { ...task, status: status as 'todo' | 'in-progress' | 'completed' };
    this.taskService.updateTask(updatedTask).subscribe(() => this.loadTasks());
  }

  /**
   * Determine CSS class for priority badge
   */
  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  /**
   * Check if task is overdue
   */
  isTaskOverdue(task: Task): boolean {
    if (task.status === 'completed') return false;
    const dueDate = new Date(task.dueDate ?? new Date());
    const today = new Date();
    return dueDate < today;
  }

  /**
   * Get days remaining until due date
   */
  getDueDays(task: Task): number {
    const dueDate = new Date(task.dueDate ?? new Date());
    const today = new Date();
    return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Reset filters to default
   */
  resetFilters(): void {
    this.statusFilter = 'all';
    this.priorityFilter = 'all';
    this.searchTerm = '';
    this.sortOption = 'dueDate';
    this.sortDirection = 'asc';
    this.applyFilters();
  }
}
