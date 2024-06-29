import { createUser } from "../../src/user/user.service";
import { IUser, UserModel } from "../../src/user/user.model";

jest.mock("../../src/user/user.model", () => ({
  UserModel: {
    create: jest.fn(),
  },
}));

afterEach(() => {
  // Clear mock calls after each test
  jest.clearAllMocks();
});

describe("User Service", () => {
  describe("createUser Function", () => {
    const userData: Partial<IUser> = {
      email: "test@gmail.com",
      password: "r7wpg0A782IEVeDApfUv",
    };

    it("should create a new user when data received is correct", async () => {
      const createdUser: Partial<IUser> = {
        firstName: "Andrei",
        lastName: "Ciobanu",
        email: "test@test12.com",
        password:
          "$2b$10$.ru6aysdLKusSWgRTc0kSOFGEDp.BQ1mfB2tyWlpJlbaHHQJbpNI.",
        createdAt: new Date("2024-06-29T13:07:41.341Z"),
        emailVerified: false,
        _id: "6680073e1aa798b946ab1cad",
        __v: 0,
      };

      UserModel.create = jest.fn().mockResolvedValue(createdUser);

      const result = await createUser(userData);

      // Assert
      expect(UserModel.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(createdUser);
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

  describe("userAlreadyExists Function", () => {});
});
