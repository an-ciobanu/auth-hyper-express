import mongoose from "mongoose";
import connectDB from "../../src/config/database";

// Mocking createConnection method
jest.mock("mongoose", () => ({
  createConnection: jest.fn(),
}));

describe("connectDB function", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    // Save original process.env values and set mock MONGODB_URI
    originalEnv = process.env;
    process.env = { ...originalEnv, MONGODB_URI: "mock-uri" };
  });

  afterAll(() => {
    // Restore original process.env values
    process.env = originalEnv;
  });

  afterEach(() => {
    // Clear mock calls after each test
    jest.clearAllMocks();
  });

  it("should connect to MongoDB", async () => {
    // Arrange
    const mockUri = "mock-uri";

    // Mock successful connection
    mongoose.connect = jest.fn().mockReturnValue({
      then: (callback: () => void) => {
        callback(); // Simulate resolve
      },
    });

    // Act
    await connectDB();

    // Assert
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledWith(mockUri);
  });

  it("should handle MongoDB connection error", async () => {
    // Arrange
    const mockError = new Error("Connection error");

    // Mock connection error
    mongoose.connect = jest.fn().mockRejectedValue(mockError);

    // Act
    await connectDB();

    expect(mongoose.createConnection).toHaveBeenCalledTimes(0);

  });
});
