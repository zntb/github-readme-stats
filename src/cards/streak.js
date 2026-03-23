// @ts-check
import { Card } from "../common/Card.js";
import { getCardColors } from "../common/color.js";
import { kFormatter } from "../common/fmt.js";
import { flexLayout } from "../common/render.js";
import { icons } from "../common/icons.js";

const CARD_MIN_WIDTH = 300;
const CARD_DEFAULT_WIDTH = 300;

const createStatItem = (icon, value, testid) => {
  const iconSvg = `
    <svg class="icon" y="-12" viewBox="0 0 16 16" version="1.1" width="16" height="16">
      ${icon}
    </svg>
  `;
  const text = `<text data-testid="${testid}" class="stat">${value}</text>`;
  return flexLayout({ items: [iconSvg, text], gap: 20, direction: "row" }).join("");
};

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

  const card = new Card({
    width: CARD_DEFAULT_WIDTH,
    height: 150,
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

  const statItems = [
    createStatItem(icons.commits, kFormatter(currentStreak), "currentStreak"),
    createStatItem(icons.star, kFormatter(longestStreak), "longestStreak"),
    createStatItem(icons.contribs, kFormatter(totalContributingDays), "totalContributingDays"),
  ];

  const body = flexLayout({ items: statItems, gap: 25, direction: "row" }).join("");

  card.setCSS(`
    .stat { font: 800 15px "Segoe UI", Ubuntu, "Helvetica Neue", Sans-Serif, sans-serif; fill: ${textColor}; }
    .stat-bold { font: 800 20px "Segoe UI", Ubuntu, "Helvetica Neue", Sans-Serif, sans-serif; }
    .icon { fill: ${iconColor}; }
    @keyframes group_animation {
      transform: translateY(0); 0% { transform: translateY(0); } 100% { transform: translateY(0); }
    }
    .group { animation: group_animation 0.5s ease-out; }
  `);

  return card.render(`<g class="group">${body}</g>`);
};

export { renderStreakCard, CARD_MIN_WIDTH, CARD_DEFAULT_WIDTH };
export default renderStreakCard;
