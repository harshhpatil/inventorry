# Inventorry template

Inventorry is a TypeScript and Node.js foundation for generating customized inventory systems from a small, validated configuration file.

## Quick start

```bash
npm install
npm test
npm run build
node dist/cli.js init --config examples/basic.json --output generated/basic
```

The generated directory contains a `README.md`, a normalized `inventory.config.json`, and an initial domain manifest. The generated output is intentionally small and editable; persistence, authentication, UI, and integrations are planned as later layers.

## Configuration

```json
{
  "name": "Acme Inventory",
  "slug": "acme-inventory",
  "features": {
    "multiLocation": true,
    "batchTracking": false,
    "serialTracking": false
  }
}
```

Required fields are `name` and `slug`. The slug must be lowercase kebab-case. Feature flags default to `false` so generated systems have predictable behavior.

## CLI

```text
inventorry init --config <path> --output <directory>
```

The command refuses to overwrite an existing output directory unless it is empty. Generation is deterministic for the same configuration.
