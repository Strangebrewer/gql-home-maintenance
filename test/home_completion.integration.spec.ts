import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { Db, MongoClient } from 'mongodb';
import { HomeTaskFrequency } from '../src/app/home_task/models/home_task.entity';
import { HOME_TASK_COLLECTION } from '../src/common/factory/home_task.factory';
import { HomeTaskRepository } from '../src/app/home_task/home_task.repository';
import { HOME_COMPLETION_COLLECTION } from '../src/common/factory/home_completion.factory';
import { HomeCompletionRepository } from '../src/app/home_completion/home_completion.repository';
import { HomeCompletionService } from '../src/app/home_completion/home_completion.service';
import { IdGeneratorService } from '../src/shared/libs/id-generator/id-generator.service';

describe('HomeCompletion (integration)', () => {
  let container: StartedMongoDBContainer;
  let client: MongoClient;
  let db: Db;
  let module: TestingModule;
  let service: HomeCompletionService;
  let homeTaskRepository: HomeTaskRepository;

  beforeAll(async () => {
    container = await new MongoDBContainer('mongo:6').start();
    client = await MongoClient.connect(container.getConnectionString(), { directConnection: true });
    db = client.db('test');

    module = await Test.createTestingModule({
      providers: [
        { provide: HOME_TASK_COLLECTION, useValue: db.collection('home_tasks') },
        { provide: HOME_COMPLETION_COLLECTION, useValue: db.collection('home_completions') },
        HomeTaskRepository,
        HomeCompletionRepository,
        HomeCompletionService,
        IdGeneratorService,
      ],
    }).compile();

    service = module.get<HomeCompletionService>(HomeCompletionService);
    homeTaskRepository = module.get<HomeTaskRepository>(HomeTaskRepository);
  }, 60000);

  afterAll(async () => {
    await module.close();
    await client.close();
    await container.stop();
  });

  afterEach(async () => {
    await db.collection('home_tasks').deleteMany({});
    await db.collection('home_completions').deleteMany({});
  });

  async function createTask(homeId = 'HOM-123') {
    return homeTaskRepository.create({
      id: `TSK-${Date.now()}`,
      userId: 'user-1',
      homeId,
      name: 'Service HVAC',
      frequency: HomeTaskFrequency.ANNUAL,
    });
  }

  it('creates and retrieves a completion', async () => {
    const task = await createTask();
    const userId = 'user-1';
    const created = await service.create(
      { taskId: task.id, date: '2024-09-15', cost: 150 },
      userId,
    );

    expect(created.id).toMatch(/^CMP-/);
    expect(created.taskId).toBe(task.id);
    expect(created.homeId).toBe('HOM-123');
    expect(created.date).toBe('2024-09-15');
    expect(created.cost).toBe(150);
    expect(created.userId).toBe(userId);

    const found = await service.findById(created.id);
    expect(found).toEqual(created);
  });

  it('populates homeId from task', async () => {
    const task = await createTask('HOM-999');
    const created = await service.create({ taskId: task.id, date: '2024-09-15' }, 'user-1');
    expect(created.homeId).toBe('HOM-999');
  });

  it('finds completions by task', async () => {
    const task = await createTask();
    await service.create({ taskId: task.id, date: '2023-09-15' }, 'user-1');
    await service.create({ taskId: task.id, date: '2024-09-15' }, 'user-1');

    const results = await service.findByTask(task.id);
    expect(results).toHaveLength(2);
  });

  it('finds completions by home', async () => {
    const task1 = await createTask('HOM-123');
    const task2 = await createTask('HOM-123');
    const otherTask = await createTask('HOM-456');

    await service.create({ taskId: task1.id, date: '2024-01-01' }, 'user-1');
    await service.create({ taskId: task2.id, date: '2024-06-01' }, 'user-1');
    await service.create({ taskId: otherTask.id, date: '2024-01-01' }, 'user-1');

    const results = await service.findByHome('HOM-123');
    expect(results).toHaveLength(2);
  });

  it('throws when task not found during create', async () => {
    await expect(
      service.create({ taskId: 'nonexistent', date: '2024-09-15' }, 'user-1'),
    ).rejects.toThrow('Home task not found');
  });

  it('updates a completion', async () => {
    const task = await createTask();
    const created = await service.create({ taskId: task.id, date: '2024-09-15' }, 'user-1');
    const updated = await service.update(created.id, { cost: 175, notes: 'Needed extra refrigerant' });
    expect(updated.cost).toBe(175);
    expect(updated.notes).toBe('Needed extra refrigerant');
    expect(updated.date).toBe('2024-09-15');
  });

  it('deletes a completion', async () => {
    const task = await createTask();
    const created = await service.create({ taskId: task.id, date: '2024-09-15' }, 'user-1');
    const result = await service.delete(created.id);
    expect(result.deletedCount).toBe(1);
  });

  it('throws when completion not found', async () => {
    await expect(service.findById('nonexistent')).rejects.toThrow('Home completion not found');
  });
});
