# Bight.ts Tooling

This repository owns the public tooling surfaces for Bight.ts outside the runtime itself.

## What This Repo Owns

- `packages/create-bight`, which publishes the `create-bight` scaffolding CLI
- `packages/docs`, which builds and deploys the public docs site
- `scripts/smoke-cli.mjs`, which validates scaffolded apps against published packages or local tarballs

## Local Development

CI runs on Node 22 and `pnpm@10.33.0`.

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm dev:cli
pnpm dev:docs
pnpm smoke:cli
```

## Release Model

`create-bight` publishes manually through GitHub Actions after full validation:

- lint
- typecheck
- test
- build
- smoke
- pack artifact upload
- npm publish with provenance

The docs site deploys automatically to GitHub Pages on merges to `main`.

## Docs Site

- Expected default Pages URL: <https://bight-ts.github.io/bight-ts-tooling/>
- Override with repo variables if you use a custom domain or a different owner:
  - `SITE_URL`
  - `BASE_PATH`

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.
