import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { Db, MongoClient } from 'mongodb';
import { HOME_COLLECTION } from '../src/common/factory/home.factory';
import { HomeRepository } from '../src/app/home/home.repository';
import { HomeService } from '../src/app/home/home.service';
import { IdGeneratorService } from '../src/shared/libs/id-generator/id-generator.service';

describe('Home (integration)', () => {
  let container: StartedMongoDBContainer;
  let client: MongoClient;
  let db: Db;
  let module: TestingModule;
  let service: HomeService;

  beforeAll(async () => {
    container = await new MongoDBContainer('mongo:6').start();
    client = await MongoClient.connect(container.getConnectionString(), { directConnection: true });
    db = client.db('test');

    module = await Test.createTestingModule({
      providers: [
        { provide: HOME_COLLECTION, useValue: db.collection('homes') },
        HomeRepository,
        HomeService,
        IdGeneratorService,
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
  }, 60000);

  afterAll(async () => {
    await module.close();
    await client.close();
    await container.stop();
  });

  afterEach(async () => {
    await db.collection('homes').deleteMany({});
  });

  it('creates and retrieves a home', async () => {
    const userId = 'user-1';
    const created = await service.create(
      { address: '123 Main St', yearBuilt: 1995, sqFootage: 2100 },
      userId,
    );

    expect(created.id).toMatch(/^HOM-/);
    expect(created.address).toBe('123 Main St');
    expect(created.yearBuilt).toBe(1995);
    expect(created.sqFootage).toBe(2100);
    expect(created.userId).toBe(userId);

    const found = await service.findById(created.id);
    expect(found).toEqual(created);
  });

  it('finds all homes for a user', async () => {
    await service.create({ address: '123 Main St' }, 'user-1');
    await service.create({ address: '456 Oak Ave' }, 'user-1');
    await service.create({ address: '789 Pine Rd' }, 'user-2');

    const results = await service.find('user-1');
    expect(results).toHaveLength(2);
  });

  it('updates a home', async () => {
    const created = await service.create({ address: '123 Main St' }, 'user-1');
    const updated = await service.update(created.id, { sqFootage: 2400, notes: 'Added sunroom' });
    expect(updated.sqFootage).toBe(2400);
    expect(updated.notes).toBe('Added sunroom');
    expect(updated.address).toBe('123 Main St');
  });

  it('deletes a home', async () => {
    const created = await service.create({ address: '123 Main St' }, 'user-1');
    const result = await service.delete(created.id);
    expect(result.deletedCount).toBe(1);
  });

  it('throws when home not found', async () => {
    await expect(service.findById('nonexistent')).rejects.toThrow('Home not found');
  });
});
