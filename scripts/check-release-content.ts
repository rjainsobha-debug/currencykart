import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const scanRoots = ["app", "components", "config", "lib", "public"];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".html", ".svg"]);
const failures: string[] = [];
const oldOrderPrefix = "NCR" + "FX";
const oldLaunchDomain = "capital" + "travelforex";

function filesUnder(directory: string): string[] {
  const absolute = join(root, directory);
  return readdirSync(absolute).flatMap((name) => {
    const path = join(absolute, name);
    return statSync(path).isDirectory() ? filesUnder(relative(root, path)) : [path];
  });
}

const rules = [
  { label: "old NCR branding", pattern: new RegExp(`NCR\\\\s*Forex|${oldOrderPrefix}`, "gi") },
  { label: "old NCR domain", pattern: /(?:staging\.)?ncr\s*forex\.(?:com|in)|ncr\s*forex\.local/gi },
  { label: "wrong launch domain", pattern: new RegExp(`https:\\\\/\\\\/(?:staging\\\\.|www\\\\.)?(?:example|${oldLaunchDomain}|ncr\\\\s*forex)[a-z0-9.-]*`, "gi") },
  { label: "demo email", pattern: /(?:admin|kyc|rates|delivery)@currencykart\.local|aarav@example\.com/gi },
  { label: "demo password", pattern: /Demo1234!|ChangeThisAdminPassword123!/g },
  { label: "local URL", pattern: /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/gi },
  { label: "unsafe RBI authorisation claim", pattern: /\b(?:we|company|brand|platform|CurrencyKart)\s+(?:is|are)\s+RBI[- ]authori[sz]ed\b/gi }
];

for (const path of scanRoots.flatMap(filesUnder).filter((path) => extensions.has(extname(path)))) {
  const content = readFileSync(path, "utf8");
  for (const rule of rules) {
    rule.pattern.lastIndex = 0;
    for (const match of content.matchAll(rule.pattern)) {
      const before = content.slice(Math.max(0, (match.index ?? 0) - 60), match.index ?? 0).toLowerCase();
      if (rule.label === "unsafe RBI authorisation claim" && /(not|does not|must not|without claiming)\s*$/.test(before)) continue;
      if (rule.label === "wrong production domain" && /(wa\.me|schema\.org)/.test(match[0])) continue;
      failures.push(`${relative(root, path)}: ${rule.label}: ${match[0]}`);
    }
  }
}

if (failures.length) {
  console.error("Release-content check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Release-content check passed.");
