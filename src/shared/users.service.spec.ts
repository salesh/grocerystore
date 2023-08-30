import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { MongoDbService } from "../shared/mongo-db.service";
import { Employees, Users } from "./models/models";
import { ObjectId } from "mongodb";

describe("UsersService", () => {
  let usersService: UsersService;
  let mongoDbService: MongoDbService;

  const mockCollection = {
    insertOne: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: MongoDbService,
          useValue: {
            collection: jest.fn(() => mockCollection),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    mongoDbService = module.get<MongoDbService>(MongoDbService);
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      // Mock implementation for the collection insertOne method
      mockCollection.insertOne.mockResolvedValue({
        insertedId: "mocked-inserted-id",
      });

      const result = await usersService.createUser("testuser", "mocked-hash");

      expect(result.username).toBe("testuser");
      expect(result._id).toBe("mocked-inserted-id");
      expect(mockCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "testuser",
          password: "mocked-hash",
        }),
      );
    });
  });

  describe("findByUsername", () => {
    it("should find user by username", async () => {
      const mockedUser: Users = {
        _id: new ObjectId(),
        username: "testuser",
        password: "mocked-hash",
      };

      // Mock implementation for the collection findOne method
      mockCollection.findOne.mockResolvedValue(mockedUser);

      const result = await usersService.findByUsername("testuser");

      expect(result).toEqual(mockedUser);
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        username: "testuser",
      });
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const mockedUserId = new ObjectId();

      // Mock implementation for the collection updateOne method
      mockCollection.updateOne.mockResolvedValue({});

      const result = await usersService.updateUser(
        mockedUserId.toHexString(),
        "new-random",
      );

      expect(result).toEqual({});
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { _id: mockedUserId },
        { $set: { random: "new-random" } },
      );
    });
  });

  describe("deleteUser", () => {
    it("should mark a user as deleted", async () => {
      const mockedUserId = new ObjectId();

      // Mock implementation for the collection updateOne method
      mockCollection.updateOne.mockResolvedValue({});

      const result = await usersService.deleteUser(mockedUserId.toHexString());

      expect(result).toEqual({});
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { _id: mockedUserId },
        { $set: { deletedAt: expect.any(Date) } },
      );
    });
  });

  describe("findEmployeeByUserId", () => {
    it("should find an employee by userId", async () => {
      const mockedEmployee: Employees = {
        _id: new ObjectId(),
        userId: new ObjectId(),
        locationId: "mocked-location",
        role: "EMPLOYEE",
        name: "mocked-name",
      };

      // Mock implementation for the collectionEmployee findOne method
      mockCollection.findOne.mockResolvedValue(mockedEmployee);

      const result = await usersService.findEmployeeByUserId(
        mockedEmployee.userId,
      );

      expect(result).toEqual(mockedEmployee);
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        userId: mockedEmployee.userId,
      });
    });
  });
});
