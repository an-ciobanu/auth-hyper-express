import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { IUser, UserModel } from "../../src/user/user.model";
import {
  createToken,
  createUser,
  findByEmail,
  userAlreadyExists,
} from "../../src/user/user.service";

dotenv.config();

jest.mock("../../src/user/user.model", () => ({
  UserModel: {
    create: jest.fn(),
  },
}));

// Mock the jwt.sign method
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

afterEach(() => {
  // Clear mock calls after each test
  jest.clearAllMocks();
});

describe("User Service", () => {
  const userData: Partial<IUser> = {
    email: "test@gmail.com",
    password: "r7wpg0A782IEVeDApfUv",
  };

  const dataBaseUser: Partial<IUser> = {
    firstName: "Andrei",
    lastName: "Ciobanu",
    email: "test@test12.com",
    password: "$2b$10$.ru6aysdLKusSWgRTc0kSOFGEDp.BQ1mfB2tyWlpJlbaHHQJbpNI.",
    createdAt: new Date("2024-06-29T13:07:41.341Z"),
    emailVerified: false,
    _id: "6680073e1aa798b946ab1cad",
    __v: 0,
  };

  describe("createUser Function", () => {
    it("should create a new user when data received is correct", async () => {
      UserModel.create = jest.fn().mockResolvedValue(dataBaseUser);

      const result = await createUser(userData);

      // Assert
      expect(UserModel.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(dataBaseUser);
    });

    it("should throw an error if creation fails", async () => {
      const error = new Error("Creation failed");
      UserModel.create = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(createUser(userData)).rejects.toThrow("Creation failed");
    });

    it("should throw a duplicate key error if a duplicate key error occurs", async () => {
      const duplicateKeyError: Error = new Error(
        "E11000 duplicate key error collection"
      );
      UserModel.create = jest.fn().mockRejectedValue(duplicateKeyError);

      await expect(createUser(userData)).rejects.toThrow(
        "E11000 duplicate key error collection"
      );
    });
  });

  describe("userAlreadyExists Function", () => {
    it("should return true if it finds a user", async () => {
      UserModel.userAlreadyExists = jest.fn().mockResolvedValue(true);

      const result = await userAlreadyExists(userData.email as string);

	  expect(UserModel.userAlreadyExists).toHaveBeenCalledTimes(1);
      expect(UserModel.userAlreadyExists).toHaveBeenCalledWith(
        userData.email as string
      );
      expect(result).toBe(true);
    });

    it("should return false if it doesnt find a user", async () => {
      UserModel.userAlreadyExists = jest.fn().mockResolvedValue(false);

      const result = await userAlreadyExists(userData.email as string);

	  expect(UserModel.userAlreadyExists).toHaveBeenCalledTimes(1);
      expect(UserModel.userAlreadyExists).toHaveBeenCalledWith(
        userData.email as string
      );
      expect(result).toBe(false);
    });
  });

  describe("findByEmail Function", () => {
    it("should return true if it finds a user by email", async () => {
      UserModel.findByEmail = jest.fn().mockResolvedValue(dataBaseUser);

      const result = await findByEmail(userData.email as string);

	  expect(UserModel.findByEmail).toHaveBeenCalledTimes(1);
      expect(UserModel.findByEmail).toHaveBeenCalledWith(
        userData.email as string
      );
      expect(result).toBe(dataBaseUser);
    });

    it("should return null if it doesnt find a user by email", async () => {
      UserModel.findByEmail = jest.fn().mockResolvedValue(null);

      const result = await findByEmail(userData.email as string);

	  expect(UserModel.findByEmail).toHaveBeenCalledTimes(1);
      expect(UserModel.findByEmail).toHaveBeenCalledWith(
        userData.email as string
      );
      expect(result).toBe(null);
    });
  });

  describe("createToken Function", () => {
    it("should return create a valid token", async () => {
      const mockToken = "mocked_jwt_token";
      jwt.sign = jest.fn().mockReturnValue(mockToken);

      const result = await createToken(dataBaseUser as IUser);

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(dataBaseUser, process.env.TOKEN_SECRET, {
        expiresIn: "7d",
      });
      expect(result).toBe(mockToken);
    });
  });
});
