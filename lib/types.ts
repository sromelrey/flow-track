export interface Task {
  id: string;
  userId: string;
  typeId: string;
  title: string;
  completed: boolean;
  taskDate: Date;
  createdAt: Date;
  updatedAt: Date;
  taskType?: TaskType;
}

export interface TaskType {
  id: string;
  userId: string | null;
  name: string;
  color: string;
  createdAt: Date | null;
}

export interface CreateTaskInput {
  title: string;
  taskDate: Date;
  typeId: string;
}

export interface TaskValidationError {
  code: 'DAILY_LIMIT' | 'DUPLICATE_TASK' | 'INVALID_DATE';
  message: string;
}

export interface TaskResult {
  success: boolean;
  task?: Task;
  error?: TaskValidationError;
}
