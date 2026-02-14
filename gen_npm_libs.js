const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const tar = require("tar");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const OUTPUT_DIR = "lib_db";
const PROGRESS_FILE = "progress.json";
const BATCH_SIZE = 200; // safer for GitHub runner
const MAX_SECONDS = 4 * 60 * 60;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const START_TIME = Date.now();

function encodeVersion(version) {
  const parts = version.split(".");
  while (parts.length < 3) parts.push("0");
  return "v" + parts.slice(0, 3).map(p => p.padStart(4, "0")).join("");
}

function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return 0;
  return JSON.parse(fs.readFileSync(PROGRESS_FILE)).index || 0;
}

function saveProgress(index) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ index }, null, 2));
}

function getLatestVersion(pkg) {
  try {
    const version = execSync(`npm view ${pkg} version`, {
      encoding: "utf-8"
    }).trim();
    return version;
  } catch {
    return null;
  }
}

function parseFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");

    const ast = parser.parse(content, {
      sourceType: "unambiguous",
      plugins: ["typescript", "jsx"]
    });

    const result = {};

    traverse(ast, {
      FunctionDeclaration(path) {
        const name = path.node.id?.name;
        if (!name) return;

        result[name] = path.node.params.map(p =>
          p.name || "param"
        );
      },

      VariableDeclarator(path) {
        if (
          path.node.init &&
          (path.node.init.type === "ArrowFunctionExpression" ||
            path.node.init.type === "FunctionExpression")
        ) {
          const name = path.node.id.name;
          result[name] = path.node.init.params.map(p =>
            p.name || "param"
          );
        }
      },

      ClassDeclaration(path) {
        const className = path.node.id?.name;
        if (!className) return;

        result[className] = {};

        path.node.body.body.forEach(method => {
          if (method.key && method.key.name) {
            result[className][method.key.name] =
              method.params?.map(p => p.name || "param") || [];
          }
        });
      }
    });

    return result;
  } catch {
    return {};
  }
}

function walkDir(dir, final) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walkDir(full, final);
    } else if (file.endsWith(".js") || file.endsWith(".ts")) {
      const parsed = parseFile(full);
      Object.assign(final, parsed);
    }
  }
}

function buildPackage(pkg) {
  if ((Date.now() - START_TIME) / 1000 > MAX_SECONDS)
    return "TIME_LIMIT";

  console.log("Processing:", pkg);

  const version = getLatestVersion(pkg);
  if (!version) return;

  const encoded = encodeVersion(version);
  const filename = `${pkg}_${encoded}.json`;
  const outputPath = path.join(OUTPUT_DIR, filename);

  if (fs.existsSync(outputPath)) {
    console.log("Already exists");
    return;
  }

  try {
    execSync(`npm pack ${pkg}@${version}`, { stdio: "ignore" });
  } catch {
    return;
  }

  const tgz = fs.readdirSync(".").find(f => f.endsWith(".tgz"));
  if (!tgz) return;

  const extractDir = "./tmp_extract";
  if (!fs.existsSync(extractDir)) fs.mkdirSync(extractDir);

  try {
    tar.x({
      file: tgz,
      C: extractDir,
      sync: true
    });
  } catch {
    fs.rmSync(tgz, { force: true });
    return;
  }

  const final = {};
  walkDir(extractDir, final);

  if (Object.keys(final).length > 0) {
    fs.writeFileSync(outputPath, JSON.stringify(final, null, 2));
    console.log("Saved:", filename);
  }

  fs.rmSync(tgz, { force: true });
  fs.rmSync(extractDir, { recursive: true, force: true });
}

const packages = fs.readFileSync("npm_list.txt", "utf-8")
  .split("\n")
  .map(x => x.trim())
  .filter(Boolean);

let startIndex = loadProgress();
let endIndex = Math.min(startIndex + BATCH_SIZE, packages.length);

for (let i = startIndex; i < endIndex; i++) {
  const result = buildPackage(packages[i]);

  if (result === "TIME_LIMIT") break;

  saveProgress(i + 1);
}

if (endIndex >= packages.length) {
  saveProgress(0);
  console.log("All packages processed. Reset progress.");
}
