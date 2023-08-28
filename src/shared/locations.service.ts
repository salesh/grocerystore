import { Injectable } from "@nestjs/common";
import { MongoDbService } from "./mongo-db.service";
import { Locations } from "./models/models";

@Injectable()
export class LocationsService {
  constructor(private mongodbService: MongoDbService) {}

  private collection(): any {
    return this.mongodbService.collection("locations");
  }

  async findLocation(locationId: string): Promise<Locations> {
    return this.collection().findOne({ _id: locationId });
  }

  async findLocationDescendants(location: Locations): Promise<Locations[]> {
    return this.collection()
      .find({
        left: { $gt: location.left },
        right: { $lt: location.right },
      })
      .toArray();
  }
}
