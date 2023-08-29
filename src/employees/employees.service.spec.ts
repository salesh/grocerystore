import { Test, TestingModule } from "@nestjs/testing";
import { MongoDbService } from "../shared/mongo-db.service";
import { EmployeesService } from "./employees.service";
import { Employees, Locations } from "src/shared/models/models";
import Role from "../enums/role.enum";

describe("EmployeesService", () => {
  let employeesService: EmployeesService;
  let mockMongoDbService: Partial<MongoDbService>;

  beforeEach(async () => {
    mockMongoDbService = {
      collection: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        { provide: MongoDbService, useValue: mockMongoDbService },
      ],
    }).compile();

    employeesService = module.get<EmployeesService>(EmployeesService);
  });

  it("should be defined", () => {
    expect(employeesService).toBeDefined();
  });

  describe("createEmployee", () => {
    it("should create a Employee", async () => {
      const mockInsertOne = jest
        .fn()
        .mockResolvedValue({ insertedId: "insertedId" });
      mockMongoDbService.collection = jest
        .fn()
        .mockReturnValue({ insertOne: mockInsertOne });

      const employee: Employees = {
        locationId: "Beograd",
        role: Role.Employee,
        name: "Mirko",
      };

      const result = await employeesService.createEmployee(employee);

      expect(result).toEqual({
        ...employee,
        role: Role.Employee,
        _id: "insertedId",
      });
    });
  });

  describe("updateEmployee", () => {
    it("should update a Employee", async () => {
      const mockUpdateOne = jest.fn().mockResolvedValue({
        _id: "613f0741fa3b240001e77b02",
        locationId: "Novi_Sad",
        name: "Marko",
        modifiedCount: 1,
      });
      mockMongoDbService.collection = jest
        .fn()
        .mockReturnValue({ updateOne: mockUpdateOne });

      const employee: Employees = {
        _id: "613f0741fa3b240001e77b02",
        locationId: "Novi_Sad",
        name: "Marko",
      };

      const result = await employeesService.updateEmployee(employee);

      expect(result).toEqual({
        ...employee,
        modifiedCount: 1,
      });
    });
  });

  describe("findEmployeesByLocationId", () => {
    it("should find Employees by location ID", async () => {
      const mockFind = jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([
          { locationId: "Beograd", role: "Employee", name: "Mirko" },
          { locationId: "Bezanija", role: "Employee", name: "Marko" },
        ]),
      });
      mockMongoDbService.collection = jest
        .fn()
        .mockReturnValue({ find: mockFind });

      const locationId = "Srbija";

      const result =
        await employeesService.findEmployeesByLocationId(locationId);

      expect(result).toEqual([
        { locationId: "Beograd", role: "Employee", name: "Mirko" },
        { locationId: "Bezanija", role: "Employee", name: "Marko" },
      ]);
      expect(mockMongoDbService.collection).toHaveBeenCalledWith("employees");
      expect(mockFind).toHaveBeenCalledWith({
        role: Role.Employee,
        locationId,
      });
    });
  });

  describe("deleteEmployee", () => {
    it("should delete a Employee", async () => {
      const mockUpdateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
      mockMongoDbService.collection = jest
        .fn()
        .mockReturnValue({ updateOne: mockUpdateOne });

      const employeeId = "613f0741fa3b240001e77b02";

      const result = await employeesService.deleteEmployee(employeeId);

      expect(result).toEqual({ modifiedCount: 1 });
    });
  });

  describe("findEmployeesForLocationAndLocationDescendants", () => {
    it("should find Employees for location and its descendants", async () => {
      const mockFind = jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([
          { locationId: "Beograd", role: "Employee", name: "Mirko" },
          { locationId: "Bezanija", role: "Employee", name: "Marko" },
        ]),
      });
      mockMongoDbService.collection = jest
        .fn()
        .mockReturnValue({ find: mockFind });

      const locations: Locations[] = [
        { _id: "Beograd", type: "OFFICE", name: "Beograd" },
        { _id: "Bezanija", type: "OFFICE", name: "Bezanija" },
        { _id: "Radnja_6", type: "STORE", name: "Radnja 6" },
      ];

      const result =
        await employeesService.findEmployeesForLocationAndLocationDescendants(
          locations,
        );
      expect(result).toEqual([
        { locationId: "Beograd", role: "Employee", name: "Mirko" },
        { locationId: "Bezanija", role: "Employee", name: "Marko" },
      ]);
      expect(mockMongoDbService.collection).toHaveBeenCalledWith("employees");
      expect(mockFind).toHaveBeenCalledWith({
        locationId: { $in: locations.map((l) => l._id) },
        role: Role.Employee,
      });
    });
  });
});
