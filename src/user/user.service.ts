/*
	File for the user service
*/

import jwt from "jsonwebtoken";
import { IUser, UserModel } from "./user.model";

/**
 * 
 * @param data (Partial<IUser>)
 * @returns the crated user with the data submitted by the client
 */
export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  return await UserModel.create(data);
};

/**
 * 
 * @param email (string)
 * @returns true if the user exists
 * 			false otherwise
 */
export const userAlreadyExists = async (email: string): Promise<boolean> => {
  return await UserModel.userAlreadyExists(email);
};

/**
 * 	
 * @param email (string)
 * @returns user if user with email exist
 * 			null otherwise
 */
export const findByEmail = async (email: string): Promise<IUser> => {
  return await UserModel.findByEmail(email);
};

/**
 * 
 * @param user (IUser)
 * @returns JWT for the user
 */
export const createToken = (user: IUser) => {
  return jwt.sign(user.toJSON(), process.env.TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};
