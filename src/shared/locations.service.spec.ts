import { Test, TestingModule } from "@nestjs/testing";
import { LocationsService } from "./locations.service";
import { MongoDbService } from "./mongo-db.service";

describe("LocationsService", () => {
  let locationsService: LocationsService;
  let mockMongoDbService: Partial<MongoDbService>;

  beforeEach(async () => {
    mockMongoDbService = {
      collection: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        { provide: MongoDbService, useValue: mockMongoDbService },
      ],
    }).compile();

    locationsService = module.get<LocationsService>(LocationsService);
  });

  describe("findLocation", () => {
    it("should find a location by ID", async () => {
      const mockFindOne = jest.fn().mockResolvedValue({ _id: "Beograd" });
      mockMongoDbService.collection = jest
        .fn()
        .mockReturnValue({ findOne: mockFindOne });

      const locationId = "Beograd";

      const result = await locationsService.findLocation(locationId);

      expect(result).toEqual({ _id: "Beograd" });
      expect(mockMongoDbService.collection).toHaveBeenCalledWith("locations");
      expect(mockFindOne).toHaveBeenCalledWith({ _id: locationId });
    });
  });

  describe("findLocationDescendants", () => {
    it("should find location descendants", async () => {
      const mockFind = jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([
          { _id: "Radnja_4", left: 18, right: 19 },
          { _id: "Radnja_5", left: 20, right: 21 },
        ]),
      });

      mockMongoDbService.collection = jest
        .fn()
        .mockReturnValue({ find: mockFind });

      const mockLocation: any = {
        _id: "Liman",
        left: 17,
        right: 22,
      };

      const result =
        await locationsService.findLocationDescendants(mockLocation);

      expect(result).toEqual([
        { _id: "Radnja_4", left: 18, right: 19 },
        { _id: "Radnja_5", left: 20, right: 21 },
      ]);
      expect(mockMongoDbService.collection).toHaveBeenCalledWith("locations");
      expect(mockFind).toHaveBeenCalledWith({
        left: { $gt: mockLocation.left },
        right: { $lt: mockLocation.right },
      });
    });
  });
});
