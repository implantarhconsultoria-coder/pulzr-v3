import { access, readFile } from "node:fs/promises";

const required = [
  "index.html",
  "src/app.js",
  "src/styles.css"
];

await Promise.all(required.map((path) => access(new URL(`../${path}`, import.meta.url))));

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
if (!html.includes("PULZR") || !html.includes("/src/app.js")) {
  throw new Error("index.html is missing the PULZR shell or app script.");
}

console.log("PULZR prototype files are present.");
