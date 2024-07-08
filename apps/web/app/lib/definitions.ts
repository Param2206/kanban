export type Attachment = {
    id: number;
    fileName: string;
    url: string;
  }
  
  export type Task = {
    id: number;
    title: string;
    dueDate: string; // Assuming dueDate is a string in ISO format
    status: string;
    priority: string; // Assuming priority is a string like "High", "Medium", "Low", etc.
    description: string;
    attachments: Attachment[];
  }
  
  export type Category = {
    id: number;
    title: string;
    tasks: Task[];
  }
  
  export type Board = {
    id: number;
    title: string;
    description?: string; // Optional description
    categories: Category[];
  }
  
  export type Definition = {
    boards: Board[];
  }
  
  