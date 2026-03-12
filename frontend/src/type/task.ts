export interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  color?: string;
}
