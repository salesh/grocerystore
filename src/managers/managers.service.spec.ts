import { Test, TestingModule } from "@nestjs/testing";
import { ManagersService } from "./managers.service";
import { MongoDbService } from "../shared/mongo-db.service";
import { Employees, Locations } from "../shared/models/models";
import Role from "../enums/role.enum";

describe("ManagersService", () => {
  let managersService: ManagersService;
  let mockMongoDbService: Partial<MongoDbService>;

  beforeEach(async () => {
    mockMongoDbService = {
      collection: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManagersService,
        { provide: MongoDbService, useValue: mockMongoDbService },
      ],
    }).compile();

    managersService = module.get<ManagersService>(ManagersService);
  });

  it("should be defined", () => {
    expect(managersService).toBeDefined();
  });

  describe("createManager", () => {
    it("should create a manager", async () => {
      const mockInsertOne = jest
        .fn()
        .mockResolvedValue({ insertedId: "insertedId" });
      mockMongoDbService.collection = jest
        .fn()
        .mockReturnValue({ insertOne: mockInsertOne });

      const manager: Employees = {
        locationId: "Beograd",
        role: Role.Manager,
        name: "Mirko",
      };

      const result = await managersService.createManager(manager);

      expect(result).toEqual({
        ...manager,
        role: Role.Manager,
        _id: "insertedId",
      });
    });
  });

  describe("updateManager", () => {
    it("should update a manager", async () => {
      const mockUpdateOne = jest.fn().mockResolvedValue({
        _id: "613f0741fa3b240001e77b02",
        locationId: "Novi_Sad",
        name: "Marko",
        modifiedCount: 1,
      });
      mockMongoDbService.collection = jest
        .fn()
        .mockReturnValue({ updateOne: mockUpdateOne });

      const manager: Employees = {
        _id: "613f0741fa3b240001e77b02",
        locationId: "Novi_Sad",
        name: "Marko",
      };

      const result = await managersService.updateManager(manager);

      expect(result).toEqual({
        ...manager,
        modifiedCount: 1,
      });
    });
  });

  describe("findManagersByLocationId", () => {
    it("should find managers by location ID", async () => {
      const mockFind = jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([
          { locationId: "Beograd", role: "MANAGER", name: "Mirko" },
          { locationId: "Bezanija", role: "MANAGER", name: "Marko" },
        ]),
      });
      mockMongoDbService.collection = jest
        .fn()
        .mockReturnValue({ find: mockFind });

      const locationId = "Srbija";

      const result = await managersService.findManagersByLocationId(locationId);

      expect(result).toEqual([
        { locationId: "Beograd", role: "MANAGER", name: "Mirko" },
        { locationId: "Bezanija", role: "MANAGER", name: "Marko" },
      ]);
      expect(mockMongoDbService.collection).toHaveBeenCalledWith("employees");
      expect(mockFind).toHaveBeenCalledWith({ role: Role.Manager, locationId });
    });
  });

  describe("deleteManager", () => {
    it("should delete a manager", async () => {
      const mockUpdateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
      mockMongoDbService.collection = jest
        .fn()
        .mockReturnValue({ updateOne: mockUpdateOne });

      const managerId = "613f0741fa3b240001e77b02";

      const result = await managersService.deleteManager(managerId);

      expect(result).toEqual({ modifiedCount: 1 });
    });
  });

  describe("findManagersForLocationAndLocationDescendants", () => {
    it("should find managers for location and its descendants", async () => {
      const mockFind = jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([
          { locationId: "Beograd", role: "MANAGER", name: "Mirko" },
          { locationId: "Bezanija", role: "MANAGER", name: "Marko" },
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
        await managersService.findManagersForLocationAndLocationDescendants(
          locations,
        );
      expect(result).toEqual([
        { locationId: "Beograd", role: "MANAGER", name: "Mirko" },
        { locationId: "Bezanija", role: "MANAGER", name: "Marko" },
      ]);
      expect(mockMongoDbService.collection).toHaveBeenCalledWith("employees");
      expect(mockFind).toHaveBeenCalledWith({
        locationId: { $in: locations.map((l) => l._id) },
        role: Role.Manager,
      });
    });
  });
});
