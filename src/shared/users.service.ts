import { Injectable } from "@nestjs/common";
import { MongoDbService } from "../shared/mongo-db.service";
import { Users } from "./models/models";
import { ObjectId } from "mongodb";

@Injectable()
export class UsersService {
  constructor(private mongodbService: MongoDbService) {}

  private collection(): any {
    return this.mongodbService.collection("users");
  }

  async createUser(
    username: string,
    password: string
  ) {
    const newUser = {
      username,
      password, // Remember to hash the password before saving
    };
    const result = await this.collection().insertOne({
      ...newUser,
      inserted: new Date(),
      updated: new Date(),
    });
    return {
      ...newUser,
      _id: result.insertedId,
    };
  }

  async findUser(username: string): Promise<Users> {
    return this.collection()
      .findOne({
          username
      });
  }

  async updateUser(id: string, random: string): Promise<Users> {
    return this.collection().updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { random }
      }
    );
  }

  async deleteUser(id: string): Promise<Users> {
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
