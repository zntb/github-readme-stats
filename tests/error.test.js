import { describe, expect, it } from "@jest/globals";
import {
  CustomError,
  MissingParamError,
  SECONDARY_ERROR_MESSAGES,
  TRY_AGAIN_LATER,
  retrieveSecondaryMessage,
} from "../src/common/error.js";

describe("Test error.js", () => {
  describe("CustomError", () => {
    it("should create error with message and type", () => {
      const error = new CustomError("Test error", CustomError.MAX_RETRY);
      expect(error.message).toBe("Test error");
      expect(error.type).toBe("MAX_RETRY");
      expect(error.secondaryMessage).toBe(SECONDARY_ERROR_MESSAGES.MAX_RETRY);
    });

    it("should have correct static properties", () => {
      expect(CustomError.MAX_RETRY).toBe("MAX_RETRY");
      expect(CustomError.NO_TOKENS).toBe("NO_TOKENS");
      expect(CustomError.USER_NOT_FOUND).toBe("USER_NOT_FOUND");
      expect(CustomError.GRAPHQL_ERROR).toBe("GRAPHQL_ERROR");
      expect(CustomError.GITHUB_REST_API_ERROR).toBe("GITHUB_REST_API_ERROR");
      expect(CustomError.WAKATIME_ERROR).toBe("WAKATIME_ERROR");
    });

    it("should get secondary message for MAX_RETRY", () => {
      const error = new CustomError("Retry error", CustomError.MAX_RETRY);
      expect(error.secondaryMessage).toContain("deploy own instance");
    });

    it("should get secondary message for NO_TOKENS", () => {
      const error = new CustomError("No tokens", CustomError.NO_TOKENS);
      expect(error.secondaryMessage).toContain("PAT_1");
    });

    it("should get secondary message for USER_NOT_FOUND", () => {
      const error = new CustomError("User not found", CustomError.USER_NOT_FOUND);
      expect(error.secondaryMessage).toContain("organization");
    });

    it("should get secondary message for GRAPHQL_ERROR", () => {
      const error = new CustomError("GraphQL error", CustomError.GRAPHQL_ERROR);
      expect(error.secondaryMessage).toBe(TRY_AGAIN_LATER);
    });

    it("should get default secondary message for unknown type", () => {
      const error = new CustomError("Unknown error", "UNKNOWN_TYPE");
      expect(error.secondaryMessage).toBe("UNKNOWN_TYPE");
    });
  });

  describe("MissingParamError", () => {
    it("should create error with missed params", () => {
      const error = new MissingParamError(["username", "repo"], "Please provide both");
      expect(error.message).toContain('"username", "repo"');
      expect(error.missedParams).toEqual(["username", "repo"]);
      expect(error.secondaryMessage).toBe("Please provide both");
    });
  });

  describe("retrieveSecondaryMessage", () => {
    it("should retrieve secondary message from error", () => {
      const error = new CustomError("Test", CustomError.MAX_RETRY);
      expect(retrieveSecondaryMessage(error)).toBeDefined();
    });

    it("should return undefined when secondaryMessage not present", () => {
      const error = new Error("Regular error");
      expect(retrieveSecondaryMessage(error)).toBeUndefined();
    });

    it("should return undefined when secondaryMessage is not string", () => {
      const error = { secondaryMessage: 123 };
      expect(retrieveSecondaryMessage(error)).toBeUndefined();
    });
  });

  describe("SECONDARY_ERROR_MESSAGES", () => {
    it("should have all required error types", () => {
      expect(SECONDARY_ERROR_MESSAGES.MAX_RETRY).toBeDefined();
      expect(SECONDARY_ERROR_MESSAGES.NO_TOKENS).toBeDefined();
      expect(SECONDARY_ERROR_MESSAGES.USER_NOT_FOUND).toBeDefined();
      expect(SECONDARY_ERROR_MESSAGES.GRAPHQL_ERROR).toBeDefined();
      expect(SECONDARY_ERROR_MESSAGES.GITHUB_REST_API_ERROR).toBeDefined();
      expect(SECONDARY_ERROR_MESSAGES.WAKATIME_USER_NOT_FOUND).toBeDefined();
    });
  });
});
