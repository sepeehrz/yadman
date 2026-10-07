import fs from "node:fs";
import path from "node:path";

const SR = "src/app/api/service-request";
const API = "src/app/api";

function listFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

// 1) move every FILE up: service-request/<domain>/rest -> api/<domain>/rest
const files = listFiles(SR);
for (const f of files) {
  const rel = path.relative(SR, f); // e.g. auth/login/route.ts
  const parts = rel.split(path.sep);
  if (parts.length === 1) continue; // leftovers handled later (route-helpers/user-mapper)
  const dest = path.join(API, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    fs.renameSync(f, dest);
  } catch {
    fs.copyFileSync(f, dest);
    fs.rmSync(f);
  }
  console.log("moved:", rel);
}

// 2) delete leftover shared files (their content now lives in src/utils/server-helpers)
for (const leftover of ["route-helpers.ts", "user-mapper.ts"]) {
  const p = path.join(SR, leftover);
  if (fs.existsSync(p)) {
    fs.rmSync(p);
    console.log("deleted leftover:", p);
  }
}

// 3) remove now-empty directories bottom-up
function removeEmpty(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) removeEmpty(path.join(dir, e.name));
  }
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}
removeEmpty(SR);

// 4) rewrite imports in every file under src/app/api
const apiFiles = listFiles(API).filter((f) => f.endsWith(".ts"));

const VEHICLE_MAPPER_SYMBOLS = {
  mapVehicle: "@/utils/server-helpers/vehicles-helpers",
  mapVehicleService: "@/utils/server-helpers/vehicle-services-helpers",
  mapInsurance: "@/utils/server-helpers/vehicle-insurances-helpers",
  mapToll: "@/utils/server-helpers/vehicle-tolls-helpers",
  mapServiceCategory: "@/utils/server-helpers/service-categories-helpers",
};

function paramsTypeName(keys) {
  const k = keys.map((s) => s.trim()).filter(Boolean);
  const has = (x) => k.includes(x);
  if (k.length === 1 && has("checklistId")) return "IChecklistRouteParams";
  if (k.length === 2 && has("checklistId") && has("itemId"))
    return "IChecklistItemRouteParams";
  if (k.length === 1 && has("loanId")) return "ILoanRouteParams";
  if (k.length === 1 && has("reminderId")) return "IReminderRouteParams";
  if (k.length === 1 && has("trackerId")) return "ITrackerRouteParams";
  if (k.length === 1 && has("vehicleId")) return "IVehicleRouteParams";
  if (k.length === 2 && has("vehicleId") && has("insuranceId"))
    return "IVehicleInsuranceRouteParams";
  if (k.length === 2 && has("vehicleId") && has("serviceId"))
    return "IVehicleServiceRouteParams";
  if (k.length === 2 && has("vehicleId") && has("tollId"))
    return "IVehicleTollRouteParams";
  return null;
}

for (const f of apiFiles) {
  let text = fs.readFileSync(f, "utf8");
  const original = text;

  // shared route helpers
  text = text.replaceAll(
    "@/app/api/service-request/route-helpers",
    "@/utils/server-helpers/route-helpers",
  );

  // simple mapper module swaps
  text = text.replaceAll(
    /["'][^"']*checklists-mappers["']/g,
    '"@/utils/server-helpers/checklists-helpers"',
  );
  text = text.replaceAll(
    /["'][^"']*loan-mappers["']/g,
    '"@/utils/server-helpers/loans-helpers"',
  );
  text = text.replaceAll(
    /["'][^"']*reminders-mappers["']/g,
    '"@/utils/server-helpers/reminders-helpers"',
  );
  text = text.replaceAll(
    /["'][^"']*tracker-mappers["']/g,
    '"@/utils/server-helpers/trackers-helpers"',
  );
  text = text.replaceAll(
    /["'][^"']*user-mapper["']/g,
    '"@/utils/server-helpers/user-helpers"',
  );

  // vehicle-mappers: split import by symbol
  text = text.replace(
    /import \{([^}]+)\} from ["'][^"']*vehicle-mappers["'];?/g,
    (_m, symbols) => {
      const parts = symbols
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const byTarget = new Map();
      for (const sym of parts) {
        const target = VEHICLE_MAPPER_SYMBOLS[sym];
        if (!target) throw new Error("unknown vehicle mapper symbol: " + sym);
        if (!byTarget.has(target)) byTarget.set(target, []);
        byTarget.get(target).push(sym);
      }
      return [...byTarget.entries()]
        .map(([target, syms]) => `import { ${syms.join(", ")} } from "${target}";`)
        .join("\n");
    },
  );

  // IRouteParams -> named type imported from server-types
  const ifaceMatch = text.match(/interface IRouteParams \{[\s\S]*?\n\}\n?/);
  if (ifaceMatch) {
    const keys = [];
    const inner = ifaceMatch[0].match(/Promise<\{([^}]*)\}>/);
    if (inner) {
      for (const part of inner[1].split(",")) {
        const m = part.match(/(\w+)\s*:/);
        if (m) keys.push(m[1]);
      }
    }
    const typeName = paramsTypeName(keys);
    if (!typeName) throw new Error("cannot map params for " + f + ": " + keys);
    text = text.replace(ifaceMatch[0], "");
    text = text.replace(/\bIRouteParams\b/g, typeName);
    text = `import type { ${typeName} } from "@/types/server-types";\n` + text;
  }

  if (text !== original) {
    fs.writeFileSync(f, text);
    console.log("rewritten:", f);
  }
}
console.log("done");
