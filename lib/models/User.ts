import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  userName: string;
  password: string; // will store hashed password
  createdAt?: Date;
  updatedAt?: Date;
}
