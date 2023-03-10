# create-exp

Code mostly stolen from [`create-vite`](https://github.com/vitejs/vite/tree/main/packages/create-vite)

Inspired by https://github.com/bjoluc/jspsych-builder, except this just use vite.

## Scaffold a New jsPsych Experiment.

Make sure Node.js is installed.

Run the following command in the terminal.

```sh
# Use locally cached version
npm create @pcllab/exp

# Use latest version
npm create @pcllab/exp@latest
```

Also works with other package managers if installed.

```sh
# These always use latest version
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

### Versioning and Publishing

We use changesets

https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md

```
pnpm changeset
```

The `release.yml` workflow will create pull request to version the package.

Merging the pull request will cause an automatic publish to NPM.

### REMINDER npm token expires August 1, 2023

The `release` workflow will stop working. Update the Github secret `NPM_TOKEN` for the environment specified by `release.yml`. Or just publish to npm manually.
