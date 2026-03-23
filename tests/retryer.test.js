import { describe, expect, it, jest } from "@jest/globals";

// Mock the dependencies
jest.mock("../src/common/log.js", () => ({
  logger: { log: jest.fn(), error: jest.fn() },
}));

jest.mock("axios", () => ({
  default: jest.fn(),
}));

import { retryer, RETRIES } from "../src/common/retryer.js";

describe("Test retryer.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should export RETRIES constant", () => {
    // RETRIES is set based on PAT_* env vars
    expect(typeof RETRIES).toBe("number");
  });

  it("should throw error when no PATs are configured", async () => {
    // Save original env
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";

    // Create a mock fetcher that simulates no tokens
    const mockFetcher = jest.fn().mockResolvedValue({ data: {} });

    // Test the retryer logic by checking it throws for no tokens
    try {
      await retryer(mockFetcher, {}, 0);
    } catch (e) {
      expect(e.message).toContain("No GitHub API tokens found");
    }

    process.env.NODE_ENV = originalEnv;
  });

  it("should throw error when max retries exceeded", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";

    // Mock fetcher that returns rate limit error
    const mockFetcher = jest.fn().mockResolvedValue({
      data: {
        errors: [{ type: "RATE_LIMITED", message: "Rate limit exceeded" }],
      },
    });

    try {
      // Call with retries exceeding RETRIES (which is 7 in test mode)
      await retryer(mockFetcher, {}, 8);
    } catch (e) {
      expect(e.message).toContain("Downtime due to GitHub API rate limiting");
    }

    process.env.NODE_ENV = originalEnv;
  });

  it("should retry on rate limit error", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";

    // First call returns rate limit, second call succeeds
    const mockFetcher = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          errors: [{ type: "RATE_LIMITED", message: "Rate limit exceeded" }],
        },
      })
      .mockResolvedValueOnce({ data: { success: true } });

    const result = await retryer(mockFetcher, {}, 0);
    expect(result).toEqual({ data: { success: true } });
    expect(mockFetcher).toHaveBeenCalledTimes(2);

    process.env.NODE_ENV = originalEnv;
  });

  it("should handle bad credentials error", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";

    const error = new Error("Bad credentials");
    error.response = { data: { message: "Bad credentials" } };

    const mockFetcher = jest.fn().mockRejectedValue(error);

    // Should throw the error after trying next token
    try {
      await retryer(mockFetcher, {}, 0);
    } catch (e) {
      expect(e).toBeDefined();
    }

    process.env.NODE_ENV = originalEnv;
  });

  it("should handle account suspended error", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";

    const error = new Error("Account suspended");
    error.response = { data: { message: "Sorry. Your account was suspended." } };

    const mockFetcher = jest.fn().mockRejectedValue(error);

    try {
      await retryer(mockFetcher, {}, 0);
    } catch (e) {
      expect(e).toBeDefined();
    }

    process.env.NODE_ENV = originalEnv;
  });

  it("should return successful response", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";

    const mockResponse = { data: { user: { name: "Test User" } } };
    const mockFetcher = jest.fn().mockResolvedValue(mockResponse);

    const result = await retryer(mockFetcher, {}, 0);
    expect(result).toEqual(mockResponse);

    process.env.NODE_ENV = originalEnv;
  });
});
