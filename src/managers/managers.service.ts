import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Employees, Locations } from "../shared/models/models";
import { MongoDbService } from "../shared/mongo-db.service";

@Injectable()
export class ManagersService {
  constructor(private mongodbService: MongoDbService) {}

  private static MANAGER_ROLE: string = "MANAGER";

  private collection(): any {
    return this.mongodbService.collection("employees");
  }

  async createManager(manager: Employees): Promise<Employees> {
    const result = await this.collection().insertOne({
      ...manager,
      role: ManagersService.MANAGER_ROLE,
      inserted: new Date(),
      updated: new Date(),
    });
    return {
      ...manager,
      _id: result.insertedId,
    };
  }

  async updateManager(manager: Employees): Promise<Employees> {
    return this.collection().updateOne(
      {
        _id: new ObjectId(manager._id),
      },
      {
        $set: { ...manager, updated: new Date() },
      },
    );
  }

  async findManagers(): Promise<Employees[]> {
    return this.collection()
      .find({ role: ManagersService.MANAGER_ROLE })
      .toArray();
  }

  async deleteManager(id: string): Promise<Employees> {
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

  async findAllManagersForLocation(locationId: string): Promise<Employees[]> {
    return this.collection()
      .find({ locationId, role: ManagersService.MANAGER_ROLE })
      .toArray();
  }

  async findAllManagersForLocationAndLocationDescendants(
    locations: Locations[],
  ): Promise<Employees[]> {
    const locationIds = locations.map((location) => location._id);
    return this.collection()
      .find({
        locationId: { $in: locationIds },
        role: ManagersService.MANAGER_ROLE,
      })
      .toArray();
  }
}
