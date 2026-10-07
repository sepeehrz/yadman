import fs from "node:fs";
import path from "node:path";

function listFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

// 1) timeline route: extract inline schema + mapper to their new homes
const timelinePath = "src/app/api/timeline/route.ts";
{
  let text = fs.readFileSync(timelinePath, "utf8");
  const original = text;

  // drop inline zod schema block
  text = text.replace(
    /const createTimelineEventSchema = z\.object\(\{[\s\S]*?\}\);\r?\n\r?\n?/,
    "",
  );
  // drop inline row type + mapper
  text = text.replace(
    /type TimelineRow = typeof timelineEvents\.\$inferSelect;\r?\n\r?\n?/,
    "",
  );
  text = text.replace(
    /function mapTimelineEvent\(row: TimelineRow\): TimelineEvent \{[\s\S]*?\n\}\r?\n\r?\n?/,
    "",
  );
  // unused imports after extraction
  text = text.replace(/import \{ z \} from "zod";\r?\n/, "");
  text = text.replace(/import type \{ TimelineEvent \} from "@\/lib\/types";\r?\n/, "");

  const newImports = [
    'import { createTimelineEventSchema } from "@/features/dashboard/validations/timeline-schema";',
    'import { mapTimelineEvent } from "@/utils/server-helpers/timeline-helpers";',
  ].join("\n");
  text = newImports + "\n" + text;

  if (text !== original) {
    fs.writeFileSync(timelinePath, text);
    console.log("timeline route rewritten");
  }
}

// 2) vehicle sub-routes: getOwnedVehicle now lives in vehicles-helpers
for (const f of listFiles("src/app/api/vehicles")) {
  if (!f.endsWith(".ts")) continue;
  let text = fs.readFileSync(f, "utf8");
  const original = text;
  if (!/getOwnedVehicle/.test(text)) continue;

  // remove symbol from the route-helpers import list
  text = text.replace(
    /import \{\r?\n((?:[^}]*?\r?\n)*?)\} from "@\/utils\/server-helpers\/route-helpers";/,
    (m, body) => {
      const lines = body
        .split("\n")
        .map((l) => l.replace(/\r$/, ""))
        .filter((l) => l.trim() !== "getOwnedVehicle,");
      return `import {\n${lines.join("\n")}\n} from "@/utils/server-helpers/route-helpers";`;
    },
  );
  // add explicit import from vehicles-helpers
  if (!/from "@\/utils\/server-helpers\/vehicles-helpers"/.test(text)) {
    text =
      'import { getOwnedVehicle } from "@/utils/server-helpers/vehicles-helpers";\n' +
      text;
  }
  if (text !== original) {
    fs.writeFileSync(f, text);
    console.log("fixed getOwnedVehicle import:", f);
  }
}
console.log("done");
