import { getLinkedInProfile } from "@/lib/linkedin-profile";

export const runtime = "nodejs";

export async function GET() {
  const profile = await getLinkedInProfile();
  if (!profile) {
    return Response.json({ error: "Could not load LinkedIn profile." }, { status: 502 });
  }
  return Response.json(profile);
}
