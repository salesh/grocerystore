import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Employees, Locations } from "../shared/models/models";
import { MongoDbService } from "../shared/mongo-db.service";
import Role from "../enums/role.enum";

@Injectable()
export class ManagersService {
  constructor(private mongodbService: MongoDbService) {}

  private collection(): any {
    return this.mongodbService.collection("employees");
  }

  async createManager(manager: Employees): Promise<Employees> {
    const result = await this.collection().insertOne({
      ...manager,
      role: Role.Manager,
      inserted: new Date(),
      updated: new Date(),
    });
    return {
      ...manager,
      role: Role.Manager,
      _id: result.insertedId,
    };
  }

  async updateManager(manager: Employees): Promise<Employees> {
    const { _id, ...update } = manager;
    return this.collection().updateOne(
      {
        _id: new ObjectId(manager._id),
      },
      {
        $set: { ...update, updated: new Date() },
      },
    );
  }

  async findManagersByLocationId(locationId: string): Promise<Employees[]> {
    return this.collection().find({ role: Role.Manager, locationId }).toArray();
  }

  async deleteManager(managerId: string): Promise<Employees> {
    return this.collection().deleteOne({
      _id: new ObjectId(managerId),
    });
  }

  async findManagersForLocationAndLocationDescendants(
    locations: Locations[],
  ): Promise<Employees[]> {
    const locationIds = locations.map((location) => location._id);
    return this.collection()
      .find({
        locationId: { $in: locationIds },
        role: Role.Manager,
      })
      .toArray();
  }
}
