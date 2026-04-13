import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { Db, MongoClient } from 'mongodb';
import { VEHICLE_COLLECTION } from '../src/common/factory/vehicle.factory';
import { VehicleRepository } from '../src/app/vehicle/vehicle.repository';
import { VehicleService } from '../src/app/vehicle/vehicle.service';
import { IdGeneratorService } from '../src/shared/libs/id-generator/id-generator.service';

describe('Vehicle (integration)', () => {
  let container: StartedMongoDBContainer;
  let client: MongoClient;
  let db: Db;
  let module: TestingModule;
  let service: VehicleService;

  beforeAll(async () => {
    container = await new MongoDBContainer('mongo:6').start();
    client = await MongoClient.connect(container.getConnectionString(), { directConnection: true });
    db = client.db('test');

    module = await Test.createTestingModule({
      providers: [
        { provide: VEHICLE_COLLECTION, useValue: db.collection('vehicles') },
        VehicleRepository,
        VehicleService,
        IdGeneratorService,
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
  }, 60000);

  afterAll(async () => {
    await module.close();
    await client.close();
    await container.stop();
  });

  afterEach(async () => {
    await db.collection('vehicles').deleteMany({});
  });

  it('creates and retrieves a vehicle', async () => {
    const userId = 'user-1';
    const created = await service.create(
      { year: 2020, make: 'Toyota', model: 'Camry', mileage: 45000, color: 'Blue' },
      userId,
    );

    expect(created.id).toMatch(/^VHL-/);
    expect(created.year).toBe(2020);
    expect(created.make).toBe('Toyota');
    expect(created.model).toBe('Camry');
    expect(created.mileage).toBe(45000);
    expect(created.color).toBe('Blue');
    expect(created.userId).toBe(userId);

    const found = await service.findById(created.id);
    expect(found).toEqual(created);
  });

  it('finds all vehicles for a user', async () => {
    await service.create({ year: 2020, make: 'Toyota', model: 'Camry', mileage: 45000 }, 'user-1');
    await service.create({ year: 2018, make: 'Honda', model: 'Civic', mileage: 70000 }, 'user-1');
    await service.create({ year: 2022, make: 'Ford', model: 'F-150', mileage: 12000 }, 'user-2');

    const results = await service.find('user-1');
    expect(results).toHaveLength(2);
  });

  it('updates a vehicle', async () => {
    const created = await service.create(
      { year: 2020, make: 'Toyota', model: 'Camry', mileage: 45000 },
      'user-1',
    );
    const updated = await service.update(created.id, { mileage: 46500, plate: 'ABC-1234' });
    expect(updated.mileage).toBe(46500);
    expect(updated.plate).toBe('ABC-1234');
    expect(updated.make).toBe('Toyota');
  });

  it('deletes a vehicle', async () => {
    const created = await service.create(
      { year: 2020, make: 'Toyota', model: 'Camry', mileage: 45000 },
      'user-1',
    );
    const result = await service.delete(created.id);
    expect(result.deletedCount).toBe(1);
  });

  it('throws when vehicle not found', async () => {
    await expect(service.findById('nonexistent')).rejects.toThrow('Vehicle not found');
  });
});
