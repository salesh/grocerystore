import { Test, TestingModule } from "@nestjs/testing";
import { MyLogger } from "./my-logger";
import { LoggerModule } from "./logger.module";

// Mock MyLogger class
jest.mock("./my-logger");
const mockMyLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

describe("LoggerModule", () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [LoggerModule],
    })
      .overrideProvider(MyLogger)
      .useValue(mockMyLogger)
      .compile();
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });

  it("should log a message using MyLogger", () => {
    const logger = module.get<MyLogger>(MyLogger);
    const message = "Test message";
    logger.log(message);
    expect(mockMyLogger.log).toHaveBeenCalledWith(message);
  });

  it("should log an error using MyLogger", () => {
    const logger = module.get<MyLogger>(MyLogger);
    const error = new Error("Test error");
    logger.error(error.message, error.stack);
    expect(mockMyLogger.error).toHaveBeenCalledWith(error.message, error.stack);
  });
});
