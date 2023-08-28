import { Test, TestingModule } from "@nestjs/testing";
import { LoggerModule } from "../common/logger.module";
import { MongoDbService } from "./mongo-db.service";

describe("MongoDbService", () => {
  let service: MongoDbService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [MongoDbService],
    }).compile();
    service = module.get<MongoDbService>(MongoDbService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
