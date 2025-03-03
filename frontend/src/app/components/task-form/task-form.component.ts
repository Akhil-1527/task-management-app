import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  minDate: string = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  todayDate(): string {
    return new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  }
  
  taskForm!: FormGroup;
  isEditMode = false;
  taskId?: number;
  
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTask(this.taskId);
      }
    });
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['medium', Validators.required],
      status: ['todo', Validators.required]
    });
  }

  loadTask(id: number): void {
    this.taskService.getTask(id).subscribe(task => {
      this.taskForm.patchValue({
        title: task.title,
        description: task.description,
        dueDate: this.formatDate(task.dueDate),
        priority: task.priority,
        status: task.status
      });
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.markFormGroupTouched(this.taskForm);
      return;
    }

    const taskData: Task = {
      ...this.taskForm.value,
      id: this.isEditMode ? this.taskId : undefined,
      createdAt: this.isEditMode ? undefined : new Date()
    };

    if (this.isEditMode) {
      this.taskService.updateTask(taskData).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    } else {
      this.taskService.createTask(taskData).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }

  private formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get formControls() {
    return this.taskForm.controls;
  }
}