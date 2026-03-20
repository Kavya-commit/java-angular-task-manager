import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<void>();

  task: Task = {
    title: '',
    description: '',
    status: 'PENDING',
  };

  isSubmitting = false;
  errorMessage = '';

  constructor(private taskService: TaskService) {}

  createTask(): void {
    this.errorMessage = '';

    if (!this.task.title.trim()) {
      this.errorMessage = 'Title is required.';
      return;
    }

    this.isSubmitting = true;

    this.taskService.createTask(this.task).subscribe({
      next: () => {
        this.task = {
          title: '',
          description: '',
          status: 'PENDING',
        };
        this.isSubmitting = false;
        this.taskCreated.emit();
      },
      error: () => {
        this.errorMessage = 'Failed to create task.';
        this.isSubmitting = false;
      },
    });
  }
}
