// @ts-check
import { Card } from "../common/Card.js";
import { getCardColors } from "../common/color.js";
import { kFormatter } from "../common/fmt.js";
import { icons } from "../common/icons.js";

const CARD_MIN_WIDTH = 300;
const CARD_DEFAULT_WIDTH = 400;
const CARD_MAX_WIDTH = 600;

const renderStreakCard = (streakData, options = {}) => {
  const { currentStreak, longestStreak, totalContributingDays } = streakData;
  const {
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme = "default",
    border_radius,
    border_color,
    hide_border = false,
    hide_title = false,
    custom_title,
    ring_color,
    card_width,
  } = options;

  const { titleColor, textColor, iconColor, bgColor, borderColor } = getCardColors({
    title_color,
    icon_color,
    text_color,
    bg_color,
    border_color,
    ring_color,
    theme,
  });

  let width = card_width
    ? isNaN(card_width)
      ? CARD_DEFAULT_WIDTH
      : card_width < CARD_MIN_WIDTH
        ? CARD_MIN_WIDTH
        : card_width > CARD_MAX_WIDTH
          ? CARD_MAX_WIDTH
          : card_width
    : CARD_DEFAULT_WIDTH;

  // Explicit x position for each of the three columns
  const padX = 25;
  const innerWidth = width - padX * 2;
  const col0 = padX;
  const col1 = padX + Math.floor(innerWidth / 3);
  const col2 = padX + Math.floor((innerWidth * 2) / 3);

  const card = new Card({
    width,
    height: 160,
    border_radius,
    customTitle: custom_title,
    defaultTitle: "Activity Streak",
    colors: { titleColor, textColor, iconColor, bgColor, borderColor },
    titlePrefixIcon: icons.contribs,
  });

  card.setHideBorder(hide_border);
  card.setHideTitle(hide_title);
  card.setAccessibilityLabel({
    title: "Activity Streak",
    desc: `Current streak: ${currentStreak} days, Longest streak: ${longestStreak} days, Total contributing days: ${totalContributingDays}`,
  });

  card.setCSS(`
    .stat-label {
      font: 400 11px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: ${textColor};
      opacity: 0.8;
    }
    .stat-value {
      font: 800 20px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: ${textColor};
    }
    .icon { fill: ${iconColor}; }
  `);

  // Each stat column uses a hard-coded x coordinate — no flexLayout, no overlap risk.
  // The Card body g already sits at translate(0, 55), so y=0 here is just below the title.
  const body = `
    <svg x="${col0}" y="0" width="16" height="16" viewBox="0 0 16 16" class="icon">${icons.commits}</svg>
    <text x="${col0}" y="28" class="stat-label">Current Streak</text>
    <text x="${col0}" y="52" class="stat-value" data-testid="currentStreak">${kFormatter(currentStreak)}</text>

    <svg x="${col1}" y="0" width="16" height="16" viewBox="0 0 16 16" class="icon">${icons.star}</svg>
    <text x="${col1}" y="28" class="stat-label">Longest Streak</text>
    <text x="${col1}" y="52" class="stat-value" data-testid="longestStreak">${kFormatter(longestStreak)}</text>

    <svg x="${col2}" y="0" width="16" height="16" viewBox="0 0 16 16" class="icon">${icons.contribs}</svg>
    <text x="${col2}" y="28" class="stat-label">Total Days</text>
    <text x="${col2}" y="52" class="stat-value" data-testid="totalContributingDays">${kFormatter(totalContributingDays)}</text>
  `;

  return card.render(body);
};

export { renderStreakCard, CARD_MIN_WIDTH, CARD_DEFAULT_WIDTH };
export default renderStreakCard;
