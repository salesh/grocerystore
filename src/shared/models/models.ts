import { ObjectId } from "mongodb";

export interface Employees {
    _id?: ObjectId | string;
    userId?: ObjectId;
    locationId: string;
    role: EmployeeRole;
    name: string;
}

export interface Users {
    _id?: ObjectId;
    username: string;
    password: string;
}

export type EmployeeRole = "EMPLOYEE" | "MANAGER";
