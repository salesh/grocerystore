import { Injectable } from "@nestjs/common";
import { MongoDbService } from "../shared/mongo-db.service";
import { ObjectId } from "mongodb";
import { Employees, Locations } from "src/shared/models/models";

@Injectable()
export class EmployeesService {
  constructor(private mongodbService: MongoDbService) {}

  private static EMPLOYEE_ROLE: string = "EMPLOYEE";

  private collection(): any {
    return this.mongodbService.collection("employees");
  }

  async createEmployee(employee: Employees): Promise<Employees> {
    const result = await this.collection().insertOne({
      ...employee,
      role: EmployeesService.EMPLOYEE_ROLE,
      inserted: new Date(),
      updated: new Date(),
    });
    return {
      ...employee,
      _id: result.insertedId,
    };
  }

  async updateEmployee(employee: Employees): Promise<Employees> {
    const { _id, ...update } = employee;
    return this.collection().updateOne(
      {
        _id: new ObjectId(employee._id),
      },
      {
        $set: { ...update, updated: new Date() },
      },
    );
  }

  async findEmployees(): Promise<Employees[]> {
    return this.collection()
      .find({ role: EmployeesService.EMPLOYEE_ROLE })
      .toArray();
  }

  async deleteEmployee(id: string): Promise<Employees> {
    return this.collection().updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          deletedAt: new Date(),
        },
      },
    );
  }

  async findAllEmployeesForLocation(locationId: string): Promise<Employees[]> {
    return this.collection()
      .find({ locationId, role: EmployeesService.EMPLOYEE_ROLE })
      .toArray();
  }

  async findAllEmployeesForLocationAndLocationDescendants(
    locations: Locations[],
  ): Promise<Employees[]> {
    const locationIds = locations.map((location) => location._id);
    return this.collection()
      .find({
        locationId: { $in: locationIds },
        role: EmployeesService.EMPLOYEE_ROLE,
      })
      .toArray();
  }
}
