
export enum TaskStatus {
  TODO = 'todo',
  DONE = 'done'
}

export interface NotionTask {
  id: string;
  title: string;
  status: TaskStatus;
  category: string;
  dueDate?: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface WidgetCategory {
  id: string;
  name: string;
  count: number;
  icon: string;
  color: string;
}
