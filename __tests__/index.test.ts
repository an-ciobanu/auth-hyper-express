import dotenv from "dotenv";
import createApp from "../src/app";
import connectDB from "../src/config/database";

// Mocking the imports
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

jest.mock("../src/app", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../src/config/database", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("main function", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let mockApp: { listen: jest.Mock };

  beforeAll(() => {
    // Save the original process.env
    originalEnv = process.env;
    process.env = { ...originalEnv, PORT: "3000" };
  });

  afterAll(() => {
    // Restore the original process.env
    process.env = originalEnv;
  });

  beforeEach(() => {
    mockApp = { listen: jest.fn().mockResolvedValue(undefined) };
    (createApp as jest.Mock).mockResolvedValue(mockApp);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should load environment variables using dotenv", async () => {
    // Act
    const { main } = await import("../src/index"); // Importing dynamically to ensure mocks are applied
    await main();

    // Assert
    expect(dotenv.config).toHaveBeenCalled();
  });

  it("should create the app and connect to the database", async () => {
    // Act
    const { main } = await import("../src/index");
    await main();

    // Assert
    expect(createApp).toHaveBeenCalled();
    expect(connectDB).toHaveBeenCalled();
  });

  it("should start the app on the correct port", async () => {
    // Act
    const { main } = await import("../src/index");
    await main();

    // Assert
    expect(mockApp.listen).toHaveBeenCalledWith("3000");
  });

  it("should use default port if process.env.PORT is not set", async () => {
    // Arrange
    delete process.env.PORT;

    // Act
    const { main } = await import("../src/index");
    await main();

    // Assert
    expect(mockApp.listen).toHaveBeenCalledWith("3000"); // Default port
  });
});
