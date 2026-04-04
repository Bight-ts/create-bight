# Contributing

## Repo Shape

- `packages/create-bight` owns the CLI, prompts, generator, templates, and unit tests
- `packages/docs` owns the public docs site
- `scripts/smoke-cli.mjs` runs the scaffold smoke matrix

## Environment

- CI uses Node 22
- packages declare support for Node `>=20`
- the repo uses `pnpm@10.33.0`

## Local Workflow

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Pull Requests

- keep CLI, docs, and smoke changes scoped and intentional
- do not rewrite docs content unless the change requires it
- explain whether the change affects publish flow, smoke, or deployment
- wait for CI before asking for review

## CLI Smoke

Use published packages by default:

```bash
pnpm smoke:cli
```

When testing against unpublished local tarballs, export the same `BIGHT_*_PACKAGE_SPEC` variables the generator understands, then run the same command:

```bash
export BIGHT_PACKAGE_SPEC=file:/absolute/path/to/bight-ts-core-0.1.0.tgz
export BIGHT_TOOLKIT_PACKAGE_SPEC=file:/absolute/path/to/bight-toolkit-0.1.0.tgz
pnpm smoke:cli
```

## Release Flow

This repo publishes `create-bight` manually and deploys docs automatically.

For CLI releases:

1. bump `packages/create-bight/package.json`
2. make sure core and extras packages are already published
3. run the `Publish CLI` workflow
4. review the uploaded tarball artifact if needed
5. let the workflow publish to npm with provenance

Docs deployment runs on merges to `main` and uses GitHub Pages.
