export type DatabaseConfig = {
  uri?: string;
  username: string;
  password: string;
  cluster: string;
  name: string;
  collections: {
    vehicle: string;
    serviceRecord: string;
    home: string;
    homeTask: string;
    homeCompletion: string;
  };
};

export default (): DatabaseConfig => ({
  uri: process.env.MONGO_URI || undefined,
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  cluster: process.env.DB_CLUSTER || '',
  name: process.env.DB_NAME || '',
  collections: {
    vehicle: process.env.VEHICLE_COLLECTION || 'vehicles',
    serviceRecord: process.env.SERVICE_RECORD_COLLECTION || 'service_records',
    home: process.env.HOME_COLLECTION || 'homes',
    homeTask: process.env.HOME_TASK_COLLECTION || 'home_tasks',
    homeCompletion: process.env.HOME_COMPLETION_COLLECTION || 'home_completions',
  },
});
