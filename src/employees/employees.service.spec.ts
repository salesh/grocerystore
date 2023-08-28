import { Test, TestingModule } from "@nestjs/testing";
import { MongoDbService } from "../shared/mongo-db.service";
import { EmployeesService } from "./employees.service";
import { ObjectId } from "mongodb";

describe("EmployeesService", () => {
  let employeesService: EmployeesService;
  let mongoDbService: MongoDbService;

  const mockMongoDbService = {
    collection: jest.fn(() => ({
      insertOne: jest.fn((data) => ({
        insertedId: new ObjectId(),
      })),
      updateOne: jest.fn(),
      find: jest.fn(() => ({
        toArray: jest.fn(),
      })),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: MongoDbService, useValue: mockMongoDbService },
      ],
    }).compile();
    employeesService = module.get<EmployeesService>(EmployeesService);
    mongoDbService = module.get<MongoDbService>(MongoDbService);
  });

  it("should be defined", () => {
    expect(employeesService).toBeDefined();
  });
});
