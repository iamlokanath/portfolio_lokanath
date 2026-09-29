/** Filenames in public/projects. Lookup is case-insensitive. */
const files = [
  "aariah.png",
  "amagopalpur.png",
  "auth.png",
  "awsAutomatio.png",
  "careerAlign.jpg",
  "cms.png",
  "cryptoTracker.jpeg",
  "cyberfiesta.png",
  "disha.png",
  "farewell.png",
  "gcekfolio.png",
  "grievancePortal.png",
  "IMS.png",
  "income.png",
  "Jansamadhan.png",
  "lms.png",
  "music.png",
  "navalncc.png",
  "quotes.png",
  "resumeBuilder.png",
  "romi.png",
  "SAIS.png",
  "smartSell.png",
  "solviqai.png",
  "weather.png",
];

const byName = Object.fromEntries(
  files.map((name) => [name.toLowerCase(), `/projects/${name}`])
);

export function resolveProjectImage(path?: string): string {
  if (!path) return "";
  const name = path.split("/").pop()?.toLowerCase() ?? "";
  return byName[name] ?? "";
}
