import { Server } from "hyper-express";

import createServer from "../src/app";
import UserRouter from "../src/user/user.controller";

// Mock Server from hyper-express
jest.mock("hyper-express", () => ({
  Server: jest.fn().mockImplementation(() => ({
    use: jest.fn(),
  })),
}));

// Mock UserRouter
jest.mock("../src/user/user.controller", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("createServer function", () => {
  it("should set up server with UserRouter", async () => {
    // Arrange
    const mockAppInstance = {
      use: jest.fn(),
    };

    // Mock Server instance
    (Server as jest.Mock).mockImplementationOnce(() => mockAppInstance);

    // Act
    await createServer();

    // Assert
    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith();

    expect(mockAppInstance.use).toHaveBeenCalledTimes(1);
    expect(mockAppInstance.use).toHaveBeenCalledWith("/", UserRouter);
  });
});
