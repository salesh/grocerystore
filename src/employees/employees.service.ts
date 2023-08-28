import { Injectable } from "@nestjs/common";
import { MongoDbService } from "../shared/mongo-db.service";
import { ObjectId } from "mongodb";
import { Employees } from "src/shared/models/models";

@Injectable()
export class EmployeesService {
  constructor(private mongodbService: MongoDbService) {}


  private collection(): any {
    return this.mongodbService.collection("employees");
  }

  async createEmployee(employee: Employees): Promise<Employees> {
    const result = await this.collection().insertOne({
      ...employee
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
        $set: { ...update }
      }
    );
  }

  async findEmployees(): Promise<Employees[]> {
    return this.collection().find().toArray();
  }

  async deleteEmployee(id: string): Promise<Employees> {
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
