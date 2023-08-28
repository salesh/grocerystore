import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Employees } from "../shared/models/models";
import { MongoDbService } from "../shared/mongo-db.service";

@Injectable()
export class ManagersService {
  constructor(private mongodbService: MongoDbService) {}

  private collection(): any {
    return this.mongodbService.collection("managers");
  }

  async createManager(manager: Employees): Promise<Employees> {
    const result = await this.collection().insertOne({
      ...manager,
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
        $set: { ...manager }
      }
    );
  }

  async findManagers() {
    return this.collection().find().toArray();
  }

  async deleteManager(id: string): Promise<Employees> {
    return this.collection().updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          deletedAt: new Date()
        }
      }
    );
  }
}
