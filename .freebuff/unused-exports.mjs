import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("src").replaceAll("\\", "/");
const norm = (p) => p.replaceAll("\\", "/");
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = norm(path.join(dir, e.name));
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name) && !/-test\.ts$/.test(e.name)) files.push(p);
  }
})(SRC);

const rel = (p) => p.replace(process.cwd().replaceAll("\\", "/") + "/", "");
const contents = new Map(files.map((f) => [f, fs.readFileSync(f, "utf8")]));

// collect exported identifiers per file
function exportsOf(text) {
  const out = new Set();
  const declRe =
    /export\s+(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/g;
  let m;
  while ((m = declRe.exec(text))) out.add(m[1]);
  const typeRe = /export\s+(?:type|interface)\s+([A-Za-z_$][\w$]*)/g;
  while ((m = typeRe.exec(text))) out.add(m[1]);
  const listRe = /export\s*\{([^}]+)\}/g;
  while ((m = listRe.exec(text))) {
    for (const part of m[1].split(",")) {
      const name = part.split(/\s+as\s+/).pop().trim();
      if (/^[A-Za-z_$][\w$]*$/.test(name)) out.add(name);
    }
  }
  if (/export\s+default/.test(text)) out.add("default");
  return out;
}

const report = [];
for (const f of files) {
  const exps = exportsOf(contents.get(f));
  const unused = [];
  for (const name of exps) {
    let used = false;
    for (const [g, text] of contents) {
      if (g === f) continue;
      const re = new RegExp(`\\b${name.replace(/\$/g, "\\$")}\\b`);
      if (re.test(text)) {
        used = true;
        break;
      }
    }
    if (!used) unused.push(name);
  }
  if (unused.length && unused.length === exps.size) {
    report.push([rel(f), "ALL-UNUSED", unused.join(", ")]);
  } else if (unused.length) {
    report.push([rel(f), "partial", unused.join(", ")]);
  }
}


for (const [f, kind, names] of report) console.log(`${kind}\t${f}\t${names}`);
