# create-exp

Code mostly stolen from [`create-vite`](https://github.com/vitejs/vite/tree/main/packages/create-vite)

## Scaffold a New jsPsych Experiment.

Make sure Node.js is installed.

Run the following command in the terminal.

```sh
npm create @pcllab/exp

# Update to latest version if necessary,
npm create @pcllab/exp@latest
```

Also works with other package managers if installed.

```sh
yarn create @pcllab/exp

pnpm create @pcllab/exp
```

## Arguments

You can directly specify project name and template.

| option             | values     |
| ------------------ | ---------- |
| `-t`, `--template` | `js`, `ts` |

```sh
# npm 6.x
npm create @pcllab/exp my-exp --template ts

# npm 7+, extra double-dash is needed:
npm create @pcllab/exp my-exp -- --template ts

# yarn
yarn create @pcllab/exp my-exp --template ts

# pnpm
pnpm create @pcllab/exp my-exp --template ts
```

## Development

Install all dependencies as dev dependencies.

Install all dependencies as dev dependencies.

Only the final bundled file needs to be installed by end users.

```sh
# install dependencies
pnpm

# Stub dist once, no need to watch or rebuild
pnpm dev

# Run
node ./dist/index.mjs
```

### Changesets

https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md
