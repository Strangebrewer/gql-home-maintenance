export type HomeCompletionEntity = {
  id: string;
  userId: string;
  homeId: string;
  taskId: string;
  date: string;
  cost?: number;
  notes?: string;
};

export type HomeCompletionEntityRead = HomeCompletionEntity & {
  _id?: string;
};
