import { ObjectId } from "mongodb";

/*
 - Represents a user document stored in MongoDB.
 - Supports both OAuth and credentials-based users.
*/

export interface User {
  _id?: ObjectId;
  email: string;
  userName?: string;      // for credentials-based users
  name?: string;          // for OAuth users
  image?: string;         // for OAuth users
  password?: string;      // hashed password (not for OAuth)
  emailVerified?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
