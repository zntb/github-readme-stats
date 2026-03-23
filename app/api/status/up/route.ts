import { NextRequest, NextResponse } from "next/server";
import { request as graphqlRequest } from "@/src/common/http.js";
import retryer from "@/src/common/retryer.js";

export const runtime = "nodejs";

const RATE_LIMIT_SECONDS = 60 * 5;

const uptimeFetcher = (variables, token: string) => {
  return graphqlRequest(
    { query: `query { rateLimit { remaining } }`, variables },
    { Authorization: `bearer ${token}` },
  );
};

const shieldsUptimeBadge = (up: boolean) => ({
  schemaVersion: 1,
  label: "Public Instance",
  message: up ? "up" : "down",
  color: up ? "brightgreen" : "red",
  isError: true,
});

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type")?.toLowerCase() || "boolean";

  let PATsValid = true;
  try {
    await retryer(uptimeFetcher, {});
  } catch {
    PATsValid = false;
  }

  const cacheControl = PATsValid ? `max-age=0, s-maxage=${RATE_LIMIT_SECONDS}` : "no-store";

  let body;
  switch (type) {
    case "shields":
      body = shieldsUptimeBadge(PATsValid);
      break;
    case "json":
      body = { up: PATsValid };
      break;
    default:
      body = PATsValid;
      break;
  }

  return NextResponse.json(body, { headers: { "Cache-Control": cacheControl } });
}
