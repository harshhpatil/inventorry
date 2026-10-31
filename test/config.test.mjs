import assert from "node:assert/strict";
import test from "node:test";
import { ConfigValidationError, validateConfig } from "../dist/config.js";

test("validates and applies feature defaults", () => {
  assert.deepEqual(validateConfig({ name: "Acme", slug: "acme" }), {
    name: "Acme",
    slug: "acme",
    features: {
      multiLocation: false,
      batchTracking: false,
      serialTracking: false
    }
  });
});

test("reports invalid configuration fields", () => {
  assert.throws(
    () => validateConfig({ name: "", slug: "Acme Inventory", features: { batchTracking: "yes" } }),
    (error) => {
      assert.ok(error instanceof ConfigValidationError);
      assert.deepEqual(error.issues, [
        "name must be a non-empty string",
        "slug must contain lowercase letters, numbers, and single hyphens",
        "features.batchTracking must be a boolean"
      ]);
      return true;
    }
  );
});
