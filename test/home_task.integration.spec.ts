import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { Db, MongoClient } from 'mongodb';
import { HomeTaskFrequency } from '../src/app/home_task/models/home_task.entity';
import { HOME_TASK_COLLECTION } from '../src/common/factory/home_task.factory';
import { HomeTaskRepository } from '../src/app/home_task/home_task.repository';
import { HomeTaskService } from '../src/app/home_task/home_task.service';
import { IdGeneratorService } from '../src/shared/libs/id-generator/id-generator.service';

describe('HomeTask (integration)', () => {
  let container: StartedMongoDBContainer;
  let client: MongoClient;
  let db: Db;
  let module: TestingModule;
  let service: HomeTaskService;

  beforeAll(async () => {
    container = await new MongoDBContainer('mongo:6').start();
    client = await MongoClient.connect(container.getConnectionString(), { directConnection: true });
    db = client.db('test');

    module = await Test.createTestingModule({
      providers: [
        { provide: HOME_TASK_COLLECTION, useValue: db.collection('home_tasks') },
        HomeTaskRepository,
        HomeTaskService,
        IdGeneratorService,
      ],
    }).compile();

    service = module.get<HomeTaskService>(HomeTaskService);
  }, 60000);

  afterAll(async () => {
    await module.close();
    await client.close();
    await container.stop();
  });

  afterEach(async () => {
    await db.collection('home_tasks').deleteMany({});
  });

  it('creates and retrieves a home task', async () => {
    const userId = 'user-1';
    const created = await service.create(
      { homeId: 'HOM-123', name: 'Service HVAC', frequency: HomeTaskFrequency.ANNUAL },
      userId,
    );

    expect(created.id).toMatch(/^TSK-/);
    expect(created.name).toBe('Service HVAC');
    expect(created.frequency).toBe(HomeTaskFrequency.ANNUAL);
    expect(created.homeId).toBe('HOM-123');
    expect(created.userId).toBe(userId);

    const found = await service.findById(created.id);
    expect(found).toEqual(created);
  });

  it('finds all tasks for a home', async () => {
    await service.create({ homeId: 'HOM-123', name: 'Clean gutters', frequency: HomeTaskFrequency.SEASONAL }, 'user-1');
    await service.create({ homeId: 'HOM-123', name: 'Change HVAC filter', frequency: HomeTaskFrequency.MONTHLY }, 'user-1');
    await service.create({ homeId: 'HOM-456', name: 'Inspect roof', frequency: HomeTaskFrequency.ANNUAL }, 'user-1');

    const results = await service.find('HOM-123');
    expect(results).toHaveLength(2);
  });

  it('filters tasks by frequency', async () => {
    await service.create({ homeId: 'HOM-123', name: 'Change HVAC filter', frequency: HomeTaskFrequency.MONTHLY }, 'user-1');
    await service.create({ homeId: 'HOM-123', name: 'Clean gutters', frequency: HomeTaskFrequency.SEASONAL }, 'user-1');
    await service.create({ homeId: 'HOM-123', name: 'Service HVAC', frequency: HomeTaskFrequency.ANNUAL }, 'user-1');

    const monthly = await service.find('HOM-123', HomeTaskFrequency.MONTHLY);
    expect(monthly).toHaveLength(1);
    expect(monthly[0].name).toBe('Change HVAC filter');
  });

  it('updates a home task', async () => {
    const created = await service.create(
      { homeId: 'HOM-123', name: 'Service HVAC', frequency: HomeTaskFrequency.ANNUAL },
      'user-1',
    );
    const updated = await service.update(created.id, {
      name: 'Service HVAC system',
      description: 'Annual inspection and filter replacement',
    });
    expect(updated.name).toBe('Service HVAC system');
    expect(updated.description).toBe('Annual inspection and filter replacement');
    expect(updated.frequency).toBe(HomeTaskFrequency.ANNUAL);
  });

  it('deletes a home task', async () => {
    const created = await service.create(
      { homeId: 'HOM-123', name: 'Service HVAC', frequency: HomeTaskFrequency.ANNUAL },
      'user-1',
    );
    const result = await service.delete(created.id);
    expect(result.deletedCount).toBe(1);
  });

  it('throws when home task not found', async () => {
    await expect(service.findById('nonexistent')).rejects.toThrow('Home task not found');
  });
});
