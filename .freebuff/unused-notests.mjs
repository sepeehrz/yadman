import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("src").replaceAll("\\", "/");
const norm = (p) => p.replaceAll("\\", "/");
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = norm(path.join(dir, e.name));
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx|css)$/.test(e.name)) files.push(p);
  }
})(SRC);

const rel = (p) => p.replace(process.cwd().replaceAll("\\", "/") + "/", "");

function resolveFile(fromFile, spec) {
  let target;
  if (spec.startsWith("@/")) target = SRC + "/" + spec.slice(2);
  else if (spec.startsWith(".")) target = norm(path.resolve(path.dirname(fromFile), spec));
  else return null;
  const tries = [
    target,
    target + ".ts",
    target + ".tsx",
    target + ".css",
    target + "/index.ts",
    target + "/index.tsx",
  ];
  for (const t of tries) {
    try {
      if (fs.existsSync(t) && fs.statSync(t).isFile()) return norm(t);
    } catch {}
  }
  return null;
}

const deps = new Map();
const importRe = /(?:from\s+|import\s*\(\s*|require\s*\(\s*|import\s+)["']([^"']+)["']/g;
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  const set = new Set();
  let m;
  while ((m = importRe.exec(text))) {
    const r = resolveFile(f, m[1]);
    if (r) set.add(r);
  }
  deps.set(f, set);
}

const roots = files.filter(
  (f) =>
    (/\/app\/(.*\/)?(layout|not-found)\.(tsx|ts)$/.test(f) && !/\/api\//.test(f)) ||
    /\/app\/.*\/page\.(tsx|ts)$/.test(f) ||
    /\/app\/api\/.*\/route\.ts$/.test(f) ||
    /\/app\/manifest\.ts$/.test(f) ||
    /\/middleware\.ts$/.test(f) ||
    /-test\.ts$/.test(f) ||
    /\/seed\/.*\.ts$/.test(f),
);

const seen = new Set(roots);
const stack = [...roots];
while (stack.length) {
  const cur = stack.pop();
  for (const d of deps.get(cur) ?? []) {
    if (!seen.has(d)) {
      seen.add(d);
      stack.push(d);
    }
  }
}

console.log("=== UNREACHABLE FILES ===");
for (const f of files) if (!seen.has(f)) console.log(rel(f));

console.log("\n=== UNRESOLVED IMPORTS ===");
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  const re = new RegExp(importRe.source, "g");
  let m;
  while ((m = re.exec(text))) {
    const spec = m[1];
    if ((spec.startsWith("@/") || spec.startsWith(".")) && !resolveFile(f, spec)) {
      console.log(`${rel(f)} -> ${spec}`);
    }
  }
}
