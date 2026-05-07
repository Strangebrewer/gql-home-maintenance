export type HomeCompletionEntity = {
  _id: string;
  userId: string;
  homeId: string;
  taskId: string;
  date: string;
  cost?: number;
  notes?: string;
};
