export interface Task {
    id?: number;
    title: string;
    description: string;
    dueDate: string | Date;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'completed';
    createdAt?: Date;
  }