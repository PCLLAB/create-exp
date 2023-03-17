import { blue, yellow } from "kolorist";
import minimist from "minimist";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prompts from "prompts";
import validatePackageName from "validate-npm-package-name";

type Template = {
  value: string;
  display: string;
  color: (str: string | number) => string;
};

const TEMPLATES: Template[] = [
  {
    value: "ts",
    display: "Typescript (Recommended)",
    color: blue,
  },
  {
    value: "js",
    display: "Javascript",
    color: yellow,
  },
];

const renameFiles: Record<string, string | undefined> = {
  _gitignore: ".gitignore",
};

const argv = minimist<{
  t?: string;
  template?: string;
}>(process.argv.slice(2), { string: ["_"] });

const cwd = process.cwd();

async function init() {
  const argTemplate = argv.template || argv.t;

  const defaultTargetDir = "pcllab-exp";
  const argTargetDir = argv._[0];

  let targetDir = argTargetDir || defaultTargetDir;

  console.log(argTargetDir);

  const getProjectName = () =>
    targetDir === "." ? path.basename(cwd) : targetDir;

  let result: prompts.Answers<
    "targetDir" | "overwrite" | "packageName" | "template"
  >;

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : "text",
          name: "targetDir",
          message: "Project name:",
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = state.value || defaultTargetDir;
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
          name: "overwrite",
          message: () =>
            (targetDir === "."
              ? "Current directory "
              : `Target directory ${targetDir} `) +
            "is not empty. Remove existing files and continue?",
        },
        {
          type: (_, { overwrite }) => {
            if (overwrite === false) {
              throw new Error("Overwrite cancelled.");
            }
            return null;
          },
          name: "overwriteCheck",
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : "text"),
          name: "packageName",
          message: "Package name:",
          initial: () => toValidPackageName(getProjectName()),
          validate: (name) =>
            isValidPackageName(name) || "Invalid package.json name",
        },
        {
          type: () =>
            argTemplate &&
            TEMPLATES.some((template) => template.value === argTemplate)
              ? null
              : "select",
          name: "template",
          message:
            argTemplate &&
            !TEMPLATES.some((template) => template.value === argTemplate)
              ? `${argTemplate} is not a valid template. Choose from below.`
              : "Select a template.",
          initial: 0,
          choices: TEMPLATES.map((template) => ({
            title: template.color(template.display),
            value: template.value,
          })),
        },
      ],
      {
        onCancel: () => {
          throw new Error("Project scaffold cancelled.");
        },
      }
    );
  } catch (cancelled) {
    console.error(cancelled);
    return;
  }

  const projectName = getProjectName();
  const packageName = result.packageName ?? projectName;
  const template = result.template ?? argTemplate;

  const root = path.join(cwd, targetDir);

  if (result.overwrite) {
    emptyDir(targetDir);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManager = pkgInfo ? pkgInfo.name : "npm";

  console.log(`\nScaffolding project in ${root}...`);

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    `template-${template}`
  );

  const files = fs.readdirSync(templateDir);

  files.forEach((file) => {
    if (file === "package.json") return;

    copy(
      path.join(templateDir, file),
      path.join(root, renameFiles[file] ?? file)
    );
  });

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
  );

  pkg.name = packageName;

  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(pkg, null, 2)
  );

  const cdProjectName = path.relative(cwd, root);

  console.log(`\nDone! Now run:\n`);
  if (root !== cwd) {
    console.log(
      `  cd ${
        cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
      }`
    );
  }

  console.log(`  ${pkgManager} install`);
  console.log(`  ${pkgManager} run dev`);
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function isValidPackageName(projectName: string) {
  return validatePackageName(projectName).validForNewPackages;
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-]+/g, "-");
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

function emptyDir(dir: string) {
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

init().catch((e) => console.error(e));
