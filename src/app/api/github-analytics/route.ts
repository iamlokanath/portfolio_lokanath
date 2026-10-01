import { NextRequest } from "next/server";
import { GITHUB_PERIODS, getGithubAnalytics } from "@/lib/github-analytics";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get("period") || "last";
  const allowed = (GITHUB_PERIODS as readonly string[]).includes(period) ? period : "last";
  const data = await getGithubAnalytics(allowed);
  if (!data) {
    return Response.json({ error: "Could not load GitHub activity." }, { status: 502 });
  }
  return Response.json(data);
}
