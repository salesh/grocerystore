import { Injectable } from "@nestjs/common";
import { MongoDbService } from "../shared/mongo-db.service";
import { Employees, Users } from "./models/models";
import { ObjectId } from "mongodb";
import { AuthService } from "../auth/auth.service.";

@Injectable()
export class UsersService {
  constructor(private mongodbService: MongoDbService) { }

  private collection(): any {
    return this.mongodbService.collection("users");
  }

  private collectionEmployee(): any {
    return this.mongodbService.collection("employees");
  }

  async createUser(username: string, hash: string) {
    const newUser = {
      username,
      password: hash
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

  async findByUsername(username: string): Promise<Users> {
    return this.collection().findOne({
      username,
    });
  }

  async updateUser(id: string, random: string): Promise<Users> {
    return this.collection().updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { random },
      },
    );
  }

  async deleteUser(id: string): Promise<Users> {
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

  async findEmployeeByUserId(userId: ObjectId | undefined): Promise<Employees> {
    return this.collectionEmployee().findOne({
      userId,
    });
  }
}
