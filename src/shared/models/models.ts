import { ObjectId } from "mongodb";

export interface Locations {
  _id?: ObjectId | string;
  name: string;
  type: LocationType;
  left?: number;
  right?: number;
}

export interface Employees {
  _id?: ObjectId | string;
  userId?: ObjectId;
  locationId: string;
  role?: EmployeeRole;
  name: string;
}

export interface Users {
  _id?: ObjectId;
  username: string;
  password: string;
}

export type EmployeeRole = "EMPLOYEE" | "MANAGER";
export type LocationType = "OFFICE" | "STORE";
