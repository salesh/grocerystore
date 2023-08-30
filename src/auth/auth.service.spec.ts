import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { UsersService } from "../shared/users.service";
import { EmployeeRole, Users } from "../shared/models/models";

// Mock bcrypt module
jest.mock("bcrypt");

describe("AuthService", () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const mockGenSalt = jest.fn(() => "mocked-salt");
      const mockHash = jest.fn(() => "mocked-hash");

      (bcrypt.genSalt as jest.Mock).mockImplementation(mockGenSalt);
      (bcrypt.hash as jest.Mock).mockImplementation(mockHash);

      const password = "testpassword";
      const result = await authService.hashPassword(password);

      expect(mockGenSalt).toHaveBeenCalledWith();
      expect(mockHash).toHaveBeenCalledWith(password, "mocked-salt");
      expect(result).toEqual("mocked-hash");
    });
  });

  describe("isMatch", () => {
    it("should compare password and hash correctly", async () => {
      const mockCompare = jest.fn(() => true);
      (bcrypt.compare as jest.Mock).mockImplementation(mockCompare);

      const password = "myPassword";
      const hash = "mocked-hash";

      const result = await authService.isMatch(password, hash);

      expect(result).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const mockCompare = jest.fn(() => false);
      (bcrypt.compare as jest.Mock).mockImplementation(mockCompare);

      const incorrectPassword = "myPassword";
      const hash = "mocked-hash";

      const result = await authService.isMatch(incorrectPassword, hash);

      expect(result).toBe(false);
    });
  });

  describe("validateUser", () => {
    it("should validate a user with correct password", async () => {
      const username = "testUser";
      const password = "testPassword";
      const hashedPassword = await bcrypt.hash(password, 10);
      const user: Users = {
        username,
        password: hashedPassword,
      };
      usersService.findByUsername = jest.fn().mockResolvedValue(user);
      authService.isMatch = jest.fn().mockResolvedValue(true);

      const result = await authService.validateUser(username, password);

      expect(result).toEqual(user);
    });

    it("should not validate a user with incorrect password", async () => {
      const username = "testUser";
      const password = "testPassword";
      const hashedPassword = await bcrypt.hash("differentPassword", 10);
      const user: Users = {
        username,
        password: hashedPassword,
      };
      usersService.findByUsername = jest.fn().mockResolvedValue(user);
      authService.isMatch = jest.fn().mockResolvedValue(false);

      const result = await authService.validateUser(username, password);

      expect(result).toBeNull();
    });

    it("should return null for non-existent user", async () => {
      const username = "nonExistentUser";
      usersService.findByUsername = jest.fn().mockResolvedValue(null);

      const result = await authService.validateUser(username, "somePassword");

      expect(result).toBeNull();
    });
  });

  describe("generateJwtToken", () => {
    it("should generate a JWT token", async () => {
      const user: Users = {
        username: "testUser",
        password: "hashedPassword",
      };
      const role: EmployeeRole = "EMPLOYEE";
      const locationId = "123";

      const expectedToken = "generatedToken";
      jwtService.sign = jest.fn().mockReturnValue(expectedToken);

      const result = await authService.generateJwtToken(user, role, locationId);

      expect(result).toEqual({
        access_token: expectedToken,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user._id,
        username: user.username,
        role,
        locationId,
      });
    });
  });
});
