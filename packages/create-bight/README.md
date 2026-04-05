# create-bight

Scaffold a new Bight.ts Discord bot with a guided prompt flow or direct CLI flags.

## Quick start

```bash
npm create bight@latest
```

```bash
pnpm create bight
```

```bash
bun create bight
```

## Templates

Use `--template` to start from named pre-selections instead of choosing every option from scratch.

- `starter`: balanced default with validation helpers and formatter examples
- `minimal`: smallest official scaffold
- `hybrid`: slash commands plus message and prefix command support
- `ops-ready`: devtools, settings, and startup checks

Examples:

```bash
npm create bight@latest -- --template=starter
```

```bash
bun create bight --template=hybrid --package-manager=bun
```

```bash
pnpm create bight --template=ops-ready --storage=prisma --sql-provider=postgres
```

## Useful flags

- `--template=<starter|minimal|hybrid|ops-ready>`
- `--package-manager=<pnpm|bun|npm|yarn>`
- `--storage=<json|keyv|drizzle|prisma|mongoose>`
- `--sql-provider=<sqlite|postgres|mysql>`
- `--keyv-store=<sqlite|postgres|mysql|redis>`
- `--command-mode=<guild|global>`
- `--extras=<name1,name2,...>`
- `--install=<true|false>`
- `--git=<true|false>`
- `--yes`

## Local development

```bash
pnpm install
pnpm --filter create-bight test
pnpm --filter create-bight build
pnpm smoke:cli
```

Docs:

- https://bight-ts.github.io/create-bight/reference/cli/create-bight/
