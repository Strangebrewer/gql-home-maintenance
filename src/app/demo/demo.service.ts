import { Injectable } from '@nestjs/common';
import { HomeService } from '../home/home.service';
import { HomeTaskService } from '../home_task/home_task.service';
import { HomeCompletionService } from '../home_completion/home_completion.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { ServiceRecordService } from '../service_record/service_record.service';
import { HomeTaskFrequency } from '../home_task/models/home_task.entity';
import { ServiceRecordType } from '../service_record/models/service_record.entity';

function daysAgo(days: number): string {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return d.toISOString().split('T')[0];
}

@Injectable()
export class DemoService {
  constructor(
    private readonly homeService: HomeService,
    private readonly homeTaskService: HomeTaskService,
    private readonly homeCompletionService: HomeCompletionService,
    private readonly vehicleService: VehicleService,
    private readonly serviceRecordService: ServiceRecordService,
  ) {}

  async seedDemoData(userId: string, expiresAt: Date): Promise<void> {
    const opts = { expiresAt };

    // Sequential home creation so isPrimary is set correctly by the service
    const home1 = await this.homeService.create(
      { address: '42 Maple Drive, Springfield, IL', yearBuilt: 1998, sqFootage: 1800 },
      userId,
      opts,
    );
    const home2 = await this.homeService.create(
      { address: '88 Birchwood Court, Lakeside, OR', yearBuilt: 2005, sqFootage: 2200 },
      userId,
      opts,
    );

    const taskInputs = [
      { homeId: home1.id, name: 'HVAC Filter Replacement', frequency: HomeTaskFrequency.MONTHLY },
      { homeId: home1.id, name: 'Gutter Cleaning', frequency: HomeTaskFrequency.SEASONAL },
      { homeId: home1.id, name: 'Smoke Detector Test', frequency: HomeTaskFrequency.BI_ANNUAL },
      { homeId: home1.id, name: 'Roof Inspection', frequency: HomeTaskFrequency.ANNUAL },
      { homeId: home2.id, name: 'Lawn Fertilization', frequency: HomeTaskFrequency.SEASONAL },
      { homeId: home2.id, name: 'Pest Control Inspection', frequency: HomeTaskFrequency.BI_ANNUAL },
      { homeId: home2.id, name: 'Water Heater Flush', frequency: HomeTaskFrequency.ANNUAL },
      { homeId: home2.id, name: 'Window Seal Check', frequency: HomeTaskFrequency.ANNUAL },
    ];

    const tasks = await Promise.all(taskInputs.map((t) => this.homeTaskService.create(t, userId, opts)));

    const completionDates = [daysAgo(90), daysAgo(60), daysAgo(30)];

    // Sequential completions per task so lastCompletionDate ends up at the most recent date
    await Promise.all(
      tasks.map(async (task) => {
        for (const date of completionDates) {
          await this.homeCompletionService.create({ taskId: task.id, date }, userId, opts);
        }
      }),
    );

    const [v1, v2] = await Promise.all([
      this.vehicleService.create({ year: 2019, make: 'Toyota', model: 'Camry', mileage: 45000, color: 'Silver' }, userId, opts),
      this.vehicleService.create({ year: 2021, make: 'Honda', model: 'CR-V', mileage: 28000, color: 'Blue' }, userId, opts),
    ]);

    await Promise.all([
      this.serviceRecordService.create({ vehicleId: v1.id, type: ServiceRecordType.OIL_CHANGE, date: daysAgo(180), mileage: 42000, cost: 45 }, userId, opts),
      this.serviceRecordService.create({ vehicleId: v1.id, type: ServiceRecordType.TIRE_ROTATION, date: daysAgo(120), mileage: 43500, cost: 25 }, userId, opts),
      this.serviceRecordService.create({ vehicleId: v1.id, type: ServiceRecordType.OIL_CHANGE, date: daysAgo(60), mileage: 45000, cost: 45 }, userId, opts),
      this.serviceRecordService.create({ vehicleId: v2.id, type: ServiceRecordType.OIL_CHANGE, date: daysAgo(150), mileage: 25000, cost: 45 }, userId, opts),
      this.serviceRecordService.create({ vehicleId: v2.id, type: ServiceRecordType.TIRE_ROTATION, date: daysAgo(90), mileage: 26500, cost: 25 }, userId, opts),
      this.serviceRecordService.create({ vehicleId: v2.id, type: ServiceRecordType.OIL_CHANGE, date: daysAgo(30), mileage: 28000, cost: 48 }, userId, opts),
    ]);
  }
}
