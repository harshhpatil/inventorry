import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { InventoryConfig } from "./config.js";

export async function generateProject(config: InventoryConfig, outputDirectory: string): Promise<void> {
  await mkdir(outputDirectory, { recursive: true });

  await Promise.all([
    writeFile(join(outputDirectory, "inventory.config.json"), `${JSON.stringify(config, null, 2)}\n`, "utf8"),
    writeFile(join(outputDirectory, "domain.json"), `${JSON.stringify(domainManifest(config), null, 2)}\n`, "utf8"),
    writeFile(join(outputDirectory, "README.md"), projectReadme(config), "utf8")
  ]);
}

function domainManifest(config: InventoryConfig): Record<string, unknown> {
  const entities = ["product", "stockMovement"];
  if (config.features.multiLocation) {
    entities.push("location");
  }
  if (config.features.batchTracking) {
    entities.push("batch");
  }
  if (config.features.serialTracking) {
    entities.push("serialNumber");
  }

  return {
    templateVersion: "0.1.0",
    entities,
    features: config.features
  };
}

function projectReadme(config: InventoryConfig): string {
  const enabledFeatures = Object.entries(config.features)
    .filter(([, enabled]) => enabled)
    .map(([feature]) => `- ${feature}`)
    .join("\n");

  return `# ${config.name}

Generated from the Inventorry template.

## Configuration

- Slug: \`${config.slug}\`
- Enabled features:
${enabledFeatures || "- None"}

## Domain

The generated \`domain.json\` is the initial contract for products and stock movements. Add persistence, APIs, authentication, and UI as separate layers around this contract.
`;
}
