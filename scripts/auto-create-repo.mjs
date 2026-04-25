import { execSync } from "node:child_process";

const repo = process.env.GH_REPO || "bogura-kothon";
const owner = process.env.GH_OWNER;

if (!owner) {
  throw new Error("GH_OWNER is required.");
}

execSync(
  `gh api user/repos -f name=${repo} -f private=false -f auto_init=false`,
  { stdio: "inherit" }
);

execSync("git init", { stdio: "inherit" });
execSync("git add .", { stdio: "inherit" });
execSync('git commit -m "Initial production newsroom scaffold" --allow-empty', {
  stdio: "inherit"
});
execSync(`git remote add origin https://github.com/${owner}/${repo}.git`, {
  stdio: "inherit"
});
execSync("git branch -M main", { stdio: "inherit" });
execSync("git push -u origin main", { stdio: "inherit" });
