import { NextResponse } from "next/server";
import { request } from "@/src/common/http.js";
import { logger } from "@/src/common/log.js";
import { dateDiff } from "@/src/common/ops.js";

export const runtime = "nodejs";

const RATE_LIMIT_SECONDS = 60 * 5;

const uptimeFetcher = (variables, token: string) => {
  return request(
    {
      query: `query { rateLimit { remaining resetAt } }`,
      variables,
    },
    { Authorization: `bearer ${token}` },
  );
};

const getAllPATs = () => Object.keys(process.env).filter((key) => /PAT_\d*$/.exec(key));

const getPATInfo = async (fetcher: typeof uptimeFetcher, variables) => {
  const details = {};
  const PATs = getAllPATs();

  for (const pat of PATs) {
    try {
      const response = await fetcher(variables, process.env[pat] as string);
      const errors = response.data.errors;
      const hasErrors = Boolean(errors);
      const errorType = errors?.[0]?.type;
      const isRateLimited =
        (hasErrors && errorType === "RATE_LIMITED") ||
        response.data.data?.rateLimit?.remaining === 0;

      if (hasErrors && errorType !== "RATE_LIMITED") {
        details[pat] = {
          status: "error",
          error: { type: errors[0].type, message: errors[0].message },
        };
        continue;
      } else if (isRateLimited) {
        const date1 = new Date();
        const date2 = new Date(response.data?.data?.rateLimit?.resetAt);
        details[pat] = {
          status: "exhausted",
          remaining: 0,
          resetIn: dateDiff(date2, date1) + " minutes",
        };
      } else {
        details[pat] = { status: "valid", remaining: response.data.data.rateLimit.remaining };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message?.toLowerCase();
      if (errorMessage === "bad credentials") {
        details[pat] = { status: "expired" };
      } else if (errorMessage === "sorry. your account was suspended.") {
        details[pat] = { status: "suspended" };
      } else {
        throw err;
      }
    }
  }

  const filterByStatus = (status: string) =>
    Object.keys(details).filter((p) => details[p].status === status);
  const sortedDetails = Object.keys(details)
    .sort()
    .reduce((obj, key) => {
      obj[key] = details[key];
      return obj;
    }, {});

  return {
    validPATs: filterByStatus("valid"),
    expiredPATs: filterByStatus("expired"),
    exhaustedPATs: filterByStatus("exhausted"),
    suspendedPATs: filterByStatus("suspended"),
    errorPATs: filterByStatus("error"),
    details: sortedDetails,
  };
};

export async function GET() {
  try {
    const PATsInfo = await getPATInfo(uptimeFetcher, {});
    return NextResponse.json(PATsInfo, {
      headers: { "Cache-Control": `max-age=0, s-maxage=${RATE_LIMIT_SECONDS}` },
    });
  } catch (err) {
    logger.error(err);
    return new NextResponse("Something went wrong: " + err.message, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
