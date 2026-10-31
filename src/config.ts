export interface InventoryFeatures {
  multiLocation: boolean;
  batchTracking: boolean;
  serialTracking: boolean;
}

export interface InventoryConfig {
  name: string;
  slug: string;
  features: InventoryFeatures;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ConfigValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Invalid inventory configuration:\n${issues.map((issue) => `- ${issue}`).join("\n")}`);
    this.name = "ConfigValidationError";
  }
}

export function validateConfig(input: unknown): InventoryConfig {
  const issues: string[] = [];

  if (!isRecord(input)) {
    throw new ConfigValidationError(["configuration must be a JSON object"]);
  }

  const name = input.name;
  const slug = input.slug;
  const features = input.features;

  if (typeof name !== "string" || name.trim().length === 0) {
    issues.push("name must be a non-empty string");
  }

  if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
    issues.push("slug must contain lowercase letters, numbers, and single hyphens");
  }

  if (features !== undefined && !isRecord(features)) {
    issues.push("features must be an object");
  }

  const featureValues = isRecord(features) ? features : {};
  for (const feature of ["multiLocation", "batchTracking", "serialTracking"] as const) {
    if (featureValues[feature] !== undefined && typeof featureValues[feature] !== "boolean") {
      issues.push(`features.${feature} must be a boolean`);
    }
  }

  if (issues.length > 0) {
    throw new ConfigValidationError(issues);
  }

  return {
    name: (name as string).trim(),
    slug: slug as string,
    features: {
      multiLocation: featureValues.multiLocation === true,
      batchTracking: featureValues.batchTracking === true,
      serialTracking: featureValues.serialTracking === true
    }
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
