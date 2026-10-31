import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { generateProject } from "../dist/generator.js";
import { validateConfig } from "../dist/config.js";

test("generates a deterministic project manifest", async () => {
  const output = await mkdtemp(join(tmpdir(), "inventorry-"));
  const config = validateConfig({
    name: "Acme Inventory",
    slug: "acme-inventory",
    features: { multiLocation: true }
  });

  await generateProject(config, output);

  assert.deepEqual(JSON.parse(await readFile(join(output, "domain.json"), "utf8")), {
    templateVersion: "0.1.0",
    entities: ["product", "stockMovement", "location"],
    features: {
      multiLocation: true,
      batchTracking: false,
      serialTracking: false
    }
  });
});
