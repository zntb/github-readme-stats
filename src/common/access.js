// @ts-check
import { renderError } from "./render.js";
import { blacklist } from "./blacklist.js";
import { whitelist, gistWhitelist } from "./envs.js";

const NOT_WHITELISTED_USERNAME_MESSAGE = "This username is not whitelisted";
const NOT_WHITELISTED_GIST_MESSAGE = "This gist ID is not whitelisted";
const BLACKLISTED_MESSAGE = "This username is blacklisted";

/**
 * Guards access using whitelist/blacklist.
 * Returns { isPassed: boolean, errorSvg?: string }
 */
const guardAccess = ({ id, type, colors }) => {
  if (!["username", "gist", "wakatime"].includes(type)) {
    throw new Error('Invalid type. Expected "username", "gist", or "wakatime".');
  }

  const currentWhitelist = type === "gist" ? gistWhitelist : whitelist;
  const notWhitelistedMsg =
    type === "gist" ? NOT_WHITELISTED_GIST_MESSAGE : NOT_WHITELISTED_USERNAME_MESSAGE;

  if (Array.isArray(currentWhitelist) && !currentWhitelist.includes(id)) {
    const errorSvg = renderError({
      message: notWhitelistedMsg,
      secondaryMessage: "Please deploy your own instance",
      renderOptions: { ...colors, show_repo_link: false },
    });
    return { isPassed: false, errorSvg };
  }

  if (currentWhitelist === undefined) {
    if (type === "username" && blacklist.includes(id)) {
      const errorSvg = renderError({
        message: BLACKLISTED_MESSAGE,
        secondaryMessage: "Please deploy your own instance",
        renderOptions: { ...colors, show_repo_link: false },
      });
      return { isPassed: false, errorSvg };
    }
  }

  return { isPassed: true };
};

export { guardAccess };
