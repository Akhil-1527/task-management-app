import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnDestroy {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId?: number;
  minDate: string = new Date().toISOString().split('T')[0]; // Allows today’s date
  formSubscriptions: Subscription[] = [];
  isDirty = false;
  isTaskCompleted = false;

  validationMessages = {
    title: {
      required: 'Task title is required',
      minlength: 'Title must be at least 3 characters'
    },
    description: {
      required: 'Task description is required'
    },
    dueDate: {
      required: 'Due date is required',
      pastDate: 'Due date cannot be in the past'
    }
  };

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkForSavedDraft();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTask(this.taskId);
      }
    });

    this.formSubscriptions.push(
      this.taskForm.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(() => {
        this.saveFormDraft();
        this.isDirty = true;
      })
    );

    this.formSubscriptions.push(
      this.taskForm.get('status')?.valueChanges.subscribe(status => {
        this.isTaskCompleted = status === 'completed';
        this.updateFormControlsState();
      }) || new Subscription()
    );
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      dueDate: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      priority: ['medium', Validators.required],
      status: ['todo', Validators.required]
    });
  }

  /**
   * ✅ **FIXED: Ensures today’s date is selectable while validating future time**
   */
  futureDateValidator(control: any) {
    if (!control.value) return null;
  
    const selectedDate = new Date(control.value);
    const now = new Date();
  
    // ✅ Ensure we only compare date (remove time component)
    selectedDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
  
    return selectedDate < now ? { pastDate: true } : null;
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

      this.isTaskCompleted = task.status === 'completed';
      this.updateFormControlsState();
      this.clearSavedDraft();
    });
  }

  updateFormControlsState(): void {
    if (this.isTaskCompleted) {
      this.taskForm.get('title')?.disable();
      this.taskForm.get('description')?.disable();
      this.taskForm.get('dueDate')?.disable();
      this.taskForm.get('priority')?.disable();
    } else {
      this.taskForm.get('title')?.enable();
      this.taskForm.get('description')?.enable();
      this.taskForm.get('dueDate')?.enable();
      this.taskForm.get('priority')?.enable();
    }
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

    this.checkForDuplicateTasks(taskData);
  }

  checkForDuplicateTasks(taskData: Task): void {
    this.taskService.getTasks().subscribe(tasks => {
      const duplicates = tasks.filter(task => 
        task.title.toLowerCase() === taskData.title.toLowerCase() && 
        task.description.toLowerCase() === taskData.description.toLowerCase() &&
        this.formatDate(task.dueDate) === this.formatDate(taskData.dueDate) &&
        (this.isEditMode ? task.id !== this.taskId : true)
      );

      if (duplicates.length > 0) {
        if (confirm('A task with the same title, description, and due date already exists. Do you still want to save?')) {
          this.saveTask(taskData);
        }
      } else {
        this.saveTask(taskData);
      }
    });
  }

  saveTask(taskData: Task): void {
    if (this.isEditMode) {
      this.taskService.updateTask(taskData).subscribe(() => {
        this.clearSavedDraft();
        this.router.navigate(['/tasks']);
      });
    } else {
      this.taskService.createTask(taskData).subscribe(() => {
        this.clearSavedDraft();
        this.router.navigate(['/tasks']);
      });
    }
  }

  saveFormDraft(): void {
    if (!this.isEditMode && this.taskForm.dirty) {
      localStorage.setItem('taskFormDraft', JSON.stringify(this.taskForm.value));
    }
  }

  checkForSavedDraft(): void {
    const savedDraft = localStorage.getItem('taskFormDraft');
    if (savedDraft && !this.isEditMode) {
      if (confirm('You have an unsaved task draft. Would you like to restore it?')) {
        this.taskForm.patchValue(JSON.parse(savedDraft));
      } else {
        this.clearSavedDraft();
      }
    }
  }

  clearSavedDraft(): void {
    localStorage.removeItem('taskFormDraft');
    this.isDirty = false;
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

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.taskForm.dirty && !this.isEditMode) {
      this.saveFormDraft();
      $event.returnValue = true;
    }
  }

  ngOnDestroy(): void {
    this.formSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
