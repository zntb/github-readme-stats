// @ts-check
import { CustomError } from "./error.js";
import { logger } from "./log.js";

const PATs = Object.keys(process.env).filter((key) => /PAT_\d*$/.exec(key)).length;
const RETRIES = process.env.NODE_ENV === "test" ? 7 : PATs;

const retryer = async (fetcher, variables, retries = 0) => {
  if (!RETRIES) {
    throw new CustomError("No GitHub API tokens found", CustomError.NO_TOKENS);
  }
  if (retries > RETRIES) {
    throw new CustomError("Downtime due to GitHub API rate limiting", CustomError.MAX_RETRY);
  }
  try {
    let response = await fetcher(variables, process.env[`PAT_${retries + 1}`], retries);
    const errors = response?.data?.errors;
    const errorType = errors?.[0]?.type;
    const errorMsg = errors?.[0]?.message || "";
    const isRateLimited =
      (errors && errorType === "RATE_LIMITED") || /rate limit/i.test(errorMsg);
    if (isRateLimited) {
      logger.log(`PAT_${retries + 1} Failed`);
      retries++;
      return retryer(fetcher, variables, retries);
    }
    return response;
  } catch (err) {
    const e = err;
    if (!e?.response) throw e;
    const isBadCredential = e?.response?.data?.message === "Bad credentials";
    const isAccountSuspended = e?.response?.data?.message === "Sorry. Your account was suspended.";
    if (isBadCredential || isAccountSuspended) {
      logger.log(`PAT_${retries + 1} Failed`);
      retries++;
      return retryer(fetcher, variables, retries);
    }
    return e.response;
  }
};

export { retryer, RETRIES };
export default retryer;
