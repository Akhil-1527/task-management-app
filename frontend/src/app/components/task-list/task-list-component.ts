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

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    if (this.statusFilter === 'all') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === this.statusFilter);
    }
  }

  deleteTask(id?: number): void {
    if (id === undefined) {
      console.error('Task ID is undefined. Cannot delete task.');
      return;
    }
  
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks();
      });
    }
  }
  

  updateTaskStatus(task: Task, status: string): void {
    const updatedTask = { ...task, status: status as 'todo' | 'in-progress' | 'completed' };
    this.taskService.updateTask(updatedTask).subscribe(() => {
      this.loadTasks();
    });
  }
}