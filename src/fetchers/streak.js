// @ts-check

import { request } from "../common/http.js";
import { retryer } from "../common/retryer.js";
import { MissingParamError } from "../common/error.js";

const GRAPHQL_STREAK_QUERY = `
  query userStreak($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetcher for streak data.
 *
 * @param {object} variables Fetcher variables.
 * @param {string} token GitHub token.
 * @returns {Promise<import('axios').AxiosResponse>} The response.
 */
const fetcher = async (variables, token) => {
  return await request(
    { query: GRAPHQL_STREAK_QUERY, variables },
    { Authorization: `token ${token}` },
  );
};

/**
 * Calculate streak data from contribution calendar.
 *
 * @param {object} calendar Contribution calendar from GitHub API.
 * @returns {{ currentStreak: number, longestStreak: number, totalContributingDays: number }} Streak data.
 */
const calculateStreakData = (calendar) => {
  if (!calendar || !calendar.weeks) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalContributingDays: calendar?.totalContributions || 0,
    };
  }

  // Flatten all contribution days from all weeks
  const allDays = calendar.weeks.flatMap(
    (/** @type {any} */ week) => week.contributionDays,
  );

  // Calculate total contributing days (days with at least 1 contribution)
  const contributingDays = allDays.filter(
    (/** @type {any} */ day) => day.contributionCount > 0,
  );
  const totalContributingDays = contributingDays.length;

  // Calculate current streak (consecutive days ending today or yesterday)
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort days by date in descending order
  const sortedDays = [...allDays].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Find the most recent contribution day
  let lastContribDate = null;
  for (const day of sortedDays) {
    if (day.contributionCount > 0) {
      lastContribDate = new Date(day.date);
      break;
    }
  }

  if (lastContribDate) {
    lastContribDate.setHours(0, 0, 0, 0);
    const daysSinceLastContrib = Math.floor(
      (today.getTime() - lastContribDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Only count streak if last contribution was today or yesterday
    if (daysSinceLastContrib <= 1) {
      // Count backwards from the last contribution day
      let streak = 0;
      let checkDate = new Date(lastContribDate);

      for (let i = 0; i < sortedDays.length; i++) {
        const dayDate = new Date(sortedDays[i].date);
        dayDate.setHours(0, 0, 0, 0);

        const diff = Math.floor(
          (checkDate.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diff === 0 && sortedDays[i].contributionCount > 0) {
          streak++;
          checkDate = new Date(dayDate);
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (diff > 0) {
          break;
        }
      }
      currentStreak = streak;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  // Sort days by date in ascending order for longest streak calculation
  const ascendingDays = [...allDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  for (const day of ascendingDays) {
    if (day.contributionCount > 0) {
      const currentDate = new Date(day.date);
      currentDate.setHours(0, 0, 0, 0);

      if (prevDate) {
        const diff = Math.floor(
          (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      prevDate = currentDate;
    } else {
      tempStreak = 0;
      prevDate = null;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalContributingDays,
  };
};

/**
 * Fetch streak information for a given username.
 *
 * @param {object} variables Fetcher variables.
 * @param {string} variables.username GitHub username.
 * @returns {Promise<object>} Streak data.
 */
const streakFetcher = async ({ username }) => {
  if (!username) {
    throw new MissingParamError(["username"]);
  }

  const response = await retryer(fetcher, { login: username });

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }

  const calendar =
    response.data.data.user.contributionsCollection.contributionCalendar;

  return calculateStreakData(calendar);
};

export { streakFetcher };
export default streakFetcher;
