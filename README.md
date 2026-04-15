# jslibsmeta

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript" />
  <img src="https://img.shields.io/badge/npm-Integrated-red?logo=npm" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-Automated-success?logo=githubactions" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
  <img src="https://img.shields.io/badge/Scale-5k%2B%20Libraries-orange" />
</p>

<p align="center">
  <b>Large-Scale Static JavaScript Library Metadata Infrastructure</b><br>
  Automated npm package introspection using static parsing.<br>
  Designed for AI autocomplete engines, IDE tooling, and static analysis systems.
</p>

---

## 🚀 Overview

`jslibsmeta` is a fully automated JavaScript ecosystem metadata generator.

Instead of installing and executing packages, this project:

- Fetches latest package versions from npm registry
- Downloads package source distributions
- Parses JavaScript/TypeScript source files
- Extracts structured symbol metadata
- Stores version-encoded JSON outputs
- Runs entirely via GitHub Actions

The result is a scalable, version-aware static metadata database for thousands of JavaScript libraries.

---

## 🧠 Why This Exists

Modern developer tooling requires:

- Structured symbol data
- Safe static introspection
- Version-aware API tracking
- Scalable automation

Dynamic execution of npm packages for introspection is unsafe and inefficient.

`jslibsmeta` solves this using pure static source parsing at scale.

---

## 🔍 What Gets Extracted

For each npm package:

- Exported functions
- Exported classes
- Class methods
- Exported variables
- Module exports structure

Example output:

```json
{
  "createServer": ["options", "callback"],
  "Server": {
    "listen": ["port", "hostname", "callback"],
    "close": ["callback"]
  }
}
```

Each file is version encoded:

```
1.4.2 → v000100040002
```

Example:

```
express_v000400180002.json
```

---

## 📦 Output Structure

```
lib_db/
 ├── express_v000400180002.json
 ├── react_v000180020000.json
 ├── lodash_v000400170021.json
```

---

## ⚙️ Core Features

- ✅ Version encoding
- ✅ Skip already processed versions
- ✅ Resume system for large-scale processing
- ✅ GitHub Actions automation
- ✅ Handles thousands of npm packages
- ✅ No package installation
- ✅ No runtime execution
- ✅ Pure static source parsing

---

## 🔄 Resume & Automation

Designed for scalable CI workflows.

Each run:

1. Processes a batch of packages
2. Saves progress
3. Resumes in next scheduled workflow
4. Detects new versions incrementally

Supports:

- Manual trigger (`workflow_dispatch`)
- Scheduled runs (cron)
- Incremental rebuilds

---

## 🛠 Local Setup

### 1️⃣ Add package list

Create `npm_list.txt`:

```
express
react
lodash
axios
```

### 2️⃣ Install dependencies

```
npm install
```

(or required parser dependencies)

### 3️⃣ Run generator

```
node gen_npm_libs.cjs
```

---

## 📊 Scale

Designed to support:

- Incremental version tracking
- Thousands of npm packages
- Long-term automated updates
- IDE and AI tooling integration

This is infrastructure-level metadata generation for the JavaScript ecosystem.

---

## 💡 Use Cases

- Offline AI autocomplete engines
- Static LLM grounding datasets
- Web-based code editors
- Symbol indexing engines
- API surface comparison tools
- Developer tooling backends

---

## 🔒 Safety

- No dynamic `eval`
- No runtime execution
- No dependency execution

Safe for automated environments.

---

## 🧬 Roadmap

### v1 (Current)
- Exported function extraction
- Class and method extraction
- Version encoding
- Automated scaling

### v2 (Planned)
- Type inference (from TS where available)
- Return value analysis
- Symbol linking
- Structured export graph
- ESM/CommonJS normalization
- Cross-version API comparison
- Compressed dataset builds
- Optional API layer

---

## 📜 License

MIT License

---

## 🔥 Status

Work in progress  
Architecture aligned with pylibsmeta  
Designed for scalable developer tooling  

---

<p align="center">
  Built for scalable JavaScript developer infrastructure.
</p>
<p align="center">
Donate: UQDZc4_R6v2PzTDCEfHAfgBeeP1VcoQaNH49YI2ayqWfyz4m (Toncoin)
</p>
