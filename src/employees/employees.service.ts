import { Injectable } from "@nestjs/common";
import { MongoDbService } from "../shared/mongo-db.service";
import { ObjectId } from "mongodb";
import { Employees, Locations } from "src/shared/models/models";
import Role from "../enums/role.enum";

@Injectable()
export class EmployeesService {
  constructor(private mongodbService: MongoDbService) {}

  private collection(): any {
    return this.mongodbService.collection("employees");
  }

  async createEmployee(employee: Employees): Promise<Employees> {
    const result = await this.collection().insertOne({
      ...employee,
      role: Role.Employee,
      inserted: new Date(),
      updated: new Date(),
    });
    return {
      ...employee,
      role: Role.Employee,
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

  async findEmployeesByLocationId(locationId: string): Promise<Employees[]> {
    return this.collection()
      .find({ role: Role.Employee, locationId })
      .toArray();
  }

  async deleteEmployee(employeeId: string): Promise<Employees> {
    return this.collection().updateOne(
      {
        _id: new ObjectId(employeeId),
      },
      {
        $set: {
          deletedAt: new Date(),
        },
      },
    );
  }

  async findAllEmployeesForLocationAndLocationDescendants(
    locations: Locations[],
  ): Promise<Employees[]> {
    const locationIds = locations.map((location) => location._id);
    return this.collection()
      .find({
        locationId: { $in: locationIds },
        role: Role.Employee,
      })
      .toArray();
  }
}
