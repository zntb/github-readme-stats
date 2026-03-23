import { describe, expect, it } from "@jest/globals";
import { statCardLocales, repoCardLocales } from "../src/translations.js";

describe("Test translations.js", () => {
  describe("statCardLocales", () => {
    it("should generate translations with correct name and apostrophe", () => {
      const translations = statCardLocales({ name: "John", apostrophe: "s" });
      expect(translations["statcard.title"].en).toBe("John's GitHub Stats");
      expect(translations["statcard.title"].cn).toContain("John");
    });

    it("should encode HTML in name", () => {
      const translations = statCardLocales({ name: "<script>", apostrophe: "s" });
      expect(translations["statcard.title"].en).toContain("&#60;script&#62;");
    });

    it("should handle names ending with s correctly", () => {
      const translations = statCardLocales({ name: "Chris", apostrophe: "" });
      expect(translations["statcard.title"].en).toBe("Chris' GitHub Stats");
    });

    it("should have all required translation keys", () => {
      const translations = statCardLocales({ name: "Test", apostrophe: "s" });
      expect(translations["statcard.title"]).toBeDefined();
      expect(translations["statcard.ranktitle"]).toBeDefined();
      expect(translations["statcard.totalstars"]).toBeDefined();
      expect(translations["statcard.commits"]).toBeDefined();
      expect(translations["statcard.prs"]).toBeDefined();
      expect(translations["statcard.issues"]).toBeDefined();
      expect(translations["statcard.contribs"]).toBeDefined();
    });

    it("should have translations for multiple locales", () => {
      const translations = statCardLocales({ name: "Test", apostrophe: "s" });
      // Check English
      expect(translations["statcard.title"].en).toContain("GitHub Stats");
      // Check Chinese
      expect(translations["statcard.title"].cn).toContain("GitHub");
      // Check German
      expect(translations["statcard.title"].de).toContain("GitHub-Statistiken");
      // Check Japanese
      expect(translations["statcard.title"].ja).toContain("GitHub");
    });
  });

  describe("repoCardLocales", () => {
    it("should have template translation", () => {
      expect(repoCardLocales["repocard.template"]).toBeDefined();
      expect(repoCardLocales["repocard.template"].en).toBe("Template");
    });

    it("should have archived translation", () => {
      expect(repoCardLocales["repocard.archived"]).toBeDefined();
      expect(repoCardLocales["repocard.archived"].en).toBe("Archived");
    });

    it("should have translations for multiple locales", () => {
      expect(repoCardLocales["repocard.template"].cn).toBe("模板");
      expect(repoCardLocales["repocard.template"].de).toBe("Vorlage");
    });
  });
});
