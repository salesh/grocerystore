import { Test, TestingModule } from "@nestjs/testing";
import { PermissionsService } from "./permissions.service";
import { LocationsService } from "./locations.service";

describe("PermissionsService", () => {
  let permissionsService: PermissionsService;
  let locationsService: LocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: LocationsService,
          useValue: {
            findLocation: jest.fn(),
            findLocationDescendants: jest.fn(),
          },
        },
      ],
    }).compile();

    permissionsService = module.get<PermissionsService>(PermissionsService);
    locationsService = module.get<LocationsService>(LocationsService);
  });

  it("should allow access when employeeLocationId and locationId are the same", async () => {
    const result = await permissionsService.isLocationAllowedForEmployee(
      "Grad_Beograd",
      "Grad_Beograd",
    );
    expect(result).toBe(true);
  });

  it("should allow access when location is a descendant of employeeLocation", async () => {
    const findLocationMock = locationsService.findLocation as jest.Mock;
    const findLocationDescendantsMock =
      locationsService.findLocationDescendants as jest.Mock;

    findLocationMock.mockResolvedValueOnce({ _id: "Vracar" }); // Mock employee location
    findLocationDescendantsMock.mockResolvedValueOnce([
      { _id: "Radnja_6" },
      { _id: "Radnja_7" },
    ]);

    const result = await permissionsService.isLocationAllowedForEmployee(
      "Vracar",
      "Radnja_6",
    );
    expect(result).toBe(true);
  });

  it("should deny access when employeeLocation is not found", async () => {
    const findLocationMock = locationsService.findLocation as jest.Mock;
    findLocationMock.mockResolvedValueOnce(null);

    const result = await permissionsService.isLocationAllowedForEmployee(
      "Vracar1",
      "Vracar",
    );
    expect(result).toBe(false);
  });

  it("should deny access when location is not a descendant of employeeLocation", async () => {
    const findLocationMock = locationsService.findLocation as jest.Mock;
    const findLocationDescendantsMock =
      locationsService.findLocationDescendants as jest.Mock;

    findLocationMock.mockResolvedValueOnce({ _id: "Bezanija" }); // Mock employee location
    findLocationDescendantsMock.mockResolvedValueOnce([{ _id: "Radnja_6" }]);

    const result = await permissionsService.isLocationAllowedForEmployee(
      "Bezanija",
      "Novi_Beograd",
    );
    expect(result).toBe(false);
  });
});
