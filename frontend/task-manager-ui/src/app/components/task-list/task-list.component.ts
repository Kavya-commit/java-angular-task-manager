import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  selectedStatus = '';
  isLoading = false;
  errorMessage = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load tasks.';
        this.isLoading = false;
      },
    });
  }

  filterTasks(): void {
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.selectedStatus) {
      this.loadTasks();
      return;
    }

    this.taskService.getTasksByStatus(this.selectedStatus).subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to filter tasks.';
        this.isLoading = false;
      },
    });
  }

  markCompleted(task: Task): void {
    if (!task.id) return;

    const updatedTask: Task = {
      ...task,
      status: 'COMPLETED',
    };

    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => this.refreshAfterAction(),
      error: () => {
        this.errorMessage = 'Failed to update task.';
      },
    });
  }

  markInProgress(task: Task): void {
    if (!task.id) return;

    const updatedTask: Task = {
      ...task,
      status: 'IN_PROGRESS',
    };

    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => this.refreshAfterAction(),
      error: () => {
        this.errorMessage = 'Failed to update task.';
      },
    });
  }

  deleteTask(id?: number): void {
    if (!id) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => this.refreshAfterAction(),
      error: () => {
        this.errorMessage = 'Failed to delete task.';
      },
    });
  }

  refreshAfterAction(): void {
    if (this.selectedStatus) {
      this.filterTasks();
    } else {
      this.loadTasks();
    }
  }
}
