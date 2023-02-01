# create-exp

Code heavily stolen from [`create-vite`](https://github.com/vitejs/vite/tree/main/packages/create-vite)

## Scaffold a New jsPsych Experiment.

Make sure Node.js is installed.

Run the following command in the terminal.

```sh
npm create @pcllab/exp
```

Also works with other package managers if installed.

```sh
yarn create @pcllab/exp

pnpm create @pcllab/exp
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
