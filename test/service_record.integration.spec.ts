import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { Db, MongoClient } from 'mongodb';
import { ServiceRecordType } from '../src/app/service_record/models/service_record.entity';
import { SERVICE_RECORD_COLLECTION } from '../src/common/factory/service_record.factory';
import { ServiceRecordRepository } from '../src/app/service_record/service_record.repository';
import { ServiceRecordService } from '../src/app/service_record/service_record.service';
import { IdGeneratorService } from '../src/shared/libs/id-generator/id-generator.service';

describe('ServiceRecord (integration)', () => {
  let container: StartedMongoDBContainer;
  let client: MongoClient;
  let db: Db;
  let module: TestingModule;
  let service: ServiceRecordService;

  beforeAll(async () => {
    container = await new MongoDBContainer('mongo:6').start();
    client = await MongoClient.connect(container.getConnectionString(), { directConnection: true });
    db = client.db('test');

    module = await Test.createTestingModule({
      providers: [
        { provide: SERVICE_RECORD_COLLECTION, useValue: db.collection('service_records') },
        ServiceRecordRepository,
        ServiceRecordService,
        IdGeneratorService,
      ],
    }).compile();

    service = module.get<ServiceRecordService>(ServiceRecordService);
  }, 60000);

  afterAll(async () => {
    await module.close();
    await client.close();
    await container.stop();
  });

  afterEach(async () => {
    await db.collection('service_records').deleteMany({});
  });

  it('creates and retrieves an oil change', async () => {
    const userId = 'user-1';
    const created = await service.create(
      { vehicleId: 'VHL-123', type: ServiceRecordType.OIL_CHANGE, date: '2024-03-15', mileage: 45000, cost: 65 },
      userId,
    );

    expect(created.id).toMatch(/^SVC-/);
    expect(created.type).toBe(ServiceRecordType.OIL_CHANGE);
    expect(created.date).toBe('2024-03-15');
    expect(created.mileage).toBe(45000);
    expect(created.cost).toBe(65);
    expect(created.name).toBeUndefined();

    const found = await service.findById(created.id);
    expect(found).toEqual(created);
  });

  it('creates a service item with name and description', async () => {
    const created = await service.create(
      {
        vehicleId: 'VHL-123',
        type: ServiceRecordType.SERVICE_ITEM,
        date: '2024-06-01',
        mileage: 48000,
        name: 'Brake pad replacement',
        description: 'Replaced front and rear brake pads',
        cost: 320,
      },
      'user-1',
    );

    expect(created.type).toBe(ServiceRecordType.SERVICE_ITEM);
    expect(created.name).toBe('Brake pad replacement');
    expect(created.description).toBe('Replaced front and rear brake pads');
  });

  it('finds all records for a vehicle', async () => {
    await service.create({ vehicleId: 'VHL-123', type: ServiceRecordType.OIL_CHANGE, date: '2024-01-01', mileage: 40000 }, 'user-1');
    await service.create({ vehicleId: 'VHL-123', type: ServiceRecordType.TIRE_ROTATION, date: '2024-01-01', mileage: 40000 }, 'user-1');
    await service.create({ vehicleId: 'VHL-456', type: ServiceRecordType.OIL_CHANGE, date: '2024-01-01', mileage: 20000 }, 'user-1');

    const results = await service.find('VHL-123');
    expect(results).toHaveLength(2);
  });

  it('filters records by type', async () => {
    await service.create({ vehicleId: 'VHL-123', type: ServiceRecordType.OIL_CHANGE, date: '2024-01-01', mileage: 40000 }, 'user-1');
    await service.create({ vehicleId: 'VHL-123', type: ServiceRecordType.TIRE_ROTATION, date: '2024-03-01', mileage: 41000 }, 'user-1');
    await service.create({ vehicleId: 'VHL-123', type: ServiceRecordType.OIL_CHANGE, date: '2024-06-01', mileage: 45000 }, 'user-1');

    const oilChanges = await service.find('VHL-123', ServiceRecordType.OIL_CHANGE);
    expect(oilChanges).toHaveLength(2);
  });

  it('updates a service record', async () => {
    const created = await service.create(
      { vehicleId: 'VHL-123', type: ServiceRecordType.OIL_CHANGE, date: '2024-03-15', mileage: 45000 },
      'user-1',
    );
    const updated = await service.update(created.id, { cost: 72 });
    expect(updated.cost).toBe(72);
    expect(updated.mileage).toBe(45000);
  });

  it('deletes a service record', async () => {
    const created = await service.create(
      { vehicleId: 'VHL-123', type: ServiceRecordType.OIL_CHANGE, date: '2024-03-15', mileage: 45000 },
      'user-1',
    );
    const result = await service.delete(created.id);
    expect(result.deletedCount).toBe(1);
  });

  it('throws when service record not found', async () => {
    await expect(service.findById('nonexistent')).rejects.toThrow('Service record not found');
  });
});
