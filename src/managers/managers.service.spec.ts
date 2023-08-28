import { Test, TestingModule } from "@nestjs/testing";
import { MongoDbService } from "../shared/mongo-db.service";
import { ManagersService } from "./managers.service";

describe("ManagersService", () => {
  let service: ManagersService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagersService, { provide: MongoDbService, useValue: {} }],
    }).compile();
    service = module.get<ManagersService>(ManagersService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
