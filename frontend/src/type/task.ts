export interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  categories: Category[];
}

export interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  categories: Category[];
  taskToEdit?: Task | null;
}

export interface Category {
  id: number;
  name: string;
  color?: string;
}

export interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}
