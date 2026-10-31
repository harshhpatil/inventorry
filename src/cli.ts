#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { generateProject } from "./generator.js";
import { ConfigValidationError, validateConfig } from "./config.js";

const [command, ...args] = process.argv.slice(2);

if (command !== "init") {
  printUsage();
  process.exitCode = 1;
} else {
  await runInit(args);
}

async function runInit(args: string[]): Promise<void> {
  const configPath = option(args, "--config");
  const outputPath = option(args, "--output");

  if (!configPath || !outputPath) {
    console.error("init requires --config <path> and --output <directory>");
    printUsage();
    process.exitCode = 1;
    return;
  }

  try {
    const rawConfig = JSON.parse(await readFile(resolve(configPath), "utf8")) as unknown;
    const config = validateConfig(rawConfig);
    const outputDirectory = resolve(outputPath);
    const existingEntries = await readdir(outputDirectory).catch((error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    });

    if (existingEntries.length > 0) {
      throw new Error(`output directory is not empty: ${outputDirectory}`);
    }

    await generateProject(config, outputDirectory);
    console.log(`Generated ${config.name} at ${outputDirectory}`);
  } catch (error) {
    if (error instanceof ConfigValidationError || error instanceof SyntaxError || error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("generation failed");
    }
    process.exitCode = 1;
  }
}

function option(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function printUsage(): void {
  console.error("Usage: inventorry init --config <path> --output <directory>");
}
