// @ts-check
import { Card } from "../common/Card.js";
import { getCardColors } from "../common/color.js";
import { I18n } from "../common/I18n.js";
import { clampValue, lowercaseTrim } from "../common/ops.js";
import { createProgressNode, flexLayout } from "../common/render.js";
import { icons } from "../common/icons.js";
import { wakatimeCardLocales } from "../translations.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const languageColors = require("../common/languageColors.json");

const DEFAULT_CARD_WIDTH = 495;
const MIN_CARD_WIDTH = 250;
const COMPACT_LAYOUT_MIN_WIDTH = 400;
const DEFAULT_LINE_HEIGHT = 25;
const PROGRESSBAR_PADDING = 130;
const HIDDEN_PROGRESSBAR_PADDING = 170;
const COMPACT_LAYOUT_PROGRESSBAR_PADDING = 25;
const TOTAL_TEXT_WIDTH = 275;

const noCodingActivityNode = ({ color, text }) =>
  `<text x="25" y="11" class="stat bold" fill="${color}">${text}</text>`;

const formatLanguageValue = ({ display_format, lang }) =>
  display_format === "percent" ? `${lang.percent.toFixed(2).toString()} %` : lang.text;

const createCompactLangNode = ({ lang, x, y, display_format }) => {
  const color = languageColors[lang.name] || "#858585";
  const value = formatLanguageValue({ display_format, lang });
  return `
    <g transform="translate(${x}, ${y})">
      <circle cx="5" cy="6" r="5" fill="${color}" />
      <text data-testid="lang-name" x="15" y="10" class='lang-name'>${lang.name} - ${value}</text>
    </g>
  `;
};

const createLanguageTextNode = ({ langs, y, display_format, card_width }) => {
  const LEFT_X = 25;
  const RIGHT_X_BASE = 230;
  const rightOffset = (card_width - DEFAULT_CARD_WIDTH) / 2;
  const RIGHT_X = RIGHT_X_BASE + rightOffset;
  return langs.map((lang, index) => {
    const isLeft = index % 2 === 0;
    return createCompactLangNode({
      lang,
      x: isLeft ? LEFT_X : RIGHT_X,
      y: y + DEFAULT_LINE_HEIGHT * Math.floor(index / 2),
      display_format,
    });
  });
};

const createTextNode = ({
  id,
  label,
  value,
  index,
  percent,
  hideProgress,
  progressBarColor,
  progressBarBackgroundColor,
  progressBarWidth,
}) => {
  const staggerDelay = (index + 3) * 150;
  const cardProgress = hideProgress
    ? null
    : createProgressNode({
        x: 110,
        y: 4,
        progress: percent,
        color: progressBarColor,
        width: progressBarWidth,
        progressBarBackgroundColor,
        delay: staggerDelay + 300,
      });
  return `
    <g class="stagger" style="animation-delay: ${staggerDelay}ms" transform="translate(25, 0)">
      <text class="stat bold" y="12.5" data-testid="${id}">${label}:</text>
      <text class="stat" x="${hideProgress ? HIDDEN_PROGRESSBAR_PADDING : PROGRESSBAR_PADDING + progressBarWidth}" y="12.5">${value}</text>
      ${cardProgress || ""}
    </g>
  `;
};

const recalculatePercentages = (languages) => {
  const totalSum = languages.reduce((s, l) => s + l.percent, 0);
  const weight = +(100 / totalSum).toFixed(2);
  languages.forEach((l) => {
    l.percent = +(l.percent * weight).toFixed(2);
  });
};

const getStyles = ({ textColor }) => `
  .stat { font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; fill: ${textColor}; }
  @supports(-moz-appearance: auto) { .stat { font-size:12px; } }
  .stagger { opacity: 0; animation: fadeInAnimation 0.3s ease-in-out forwards; }
  .not_bold { font-weight: 400 }
  .bold { font-weight: 700 }
`;

const normalizeCardWidth = ({ value, layout }) => {
  if (value === undefined || value === null || isNaN(value)) return DEFAULT_CARD_WIDTH;
  return Math.max(layout === "compact" ? COMPACT_LAYOUT_MIN_WIDTH : MIN_CARD_WIDTH, value);
};

const renderWakatimeCard = (stats = {}, options = { hide: [] }) => {
  let { languages = [] } = stats;
  const {
    hide_title = false,
    hide_border = false,
    card_width,
    hide,
    line_height = DEFAULT_LINE_HEIGHT,
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme = "default",
    hide_progress,
    custom_title,
    locale,
    layout,
    langs_count = languages.length,
    border_radius,
    border_color,
    display_format = "time",
    disable_animations,
    ring_color,
  } = options;

  const normalizedWidth = normalizeCardWidth({ value: card_width, layout });

  if (Array.isArray(hide) && hide.length > 0) {
    const languagesToHide = new Set(hide.map((lang) => lowercaseTrim(lang)));
    languages = languages.filter((lang) => !languagesToHide.has(lowercaseTrim(lang.name)));
  }

  languages = languages.slice(0, langs_count);
  recalculatePercentages(languages);

  const i18n = new I18n({ locale, translations: wakatimeCardLocales });
  const lheight = parseInt(String(line_height), 10);
  const langsCount = clampValue(langs_count, 1, langs_count);

  const { titleColor, textColor, iconColor, bgColor, borderColor } = getCardColors({
    title_color,
    icon_color,
    text_color,
    bg_color,
    border_color,
    ring_color,
    theme,
  });

  const filteredLanguages = languages.filter((l) => l.hours || l.minutes).slice(0, langsCount);
  let height = Math.max(45 + (filteredLanguages.length + 1) * lheight, 150);

  const cssStyles = getStyles({ textColor });
  let finalLayout = "";

  if (layout === "compact") {
    const width = normalizedWidth - 5;
    height = 90 + Math.round(filteredLanguages.length / 2) * DEFAULT_LINE_HEIGHT;
    let progressOffset = 0;
    const compactProgressBar = filteredLanguages
      .map((language) => {
        const progress = ((width - COMPACT_LAYOUT_PROGRESSBAR_PADDING) * language.percent) / 100;
        const languageColor = languageColors[language.name] || "#858585";
        const output = `
        <rect mask="url(#rect-mask)" data-testid="lang-progress"
          x="${progressOffset}" y="0" width="${progress}" height="8" fill="${languageColor}" />
      `;
        progressOffset += progress;
        return output;
      })
      .join("");

    finalLayout = `
      <mask id="rect-mask">
        <rect x="${COMPACT_LAYOUT_PROGRESSBAR_PADDING}" y="0" width="${width - 2 * COMPACT_LAYOUT_PROGRESSBAR_PADDING}" height="8" fill="white" rx="5" />
      </mask>
      ${compactProgressBar}
      ${
        filteredLanguages.length
          ? createLanguageTextNode({
              y: 25,
              langs: filteredLanguages,
              display_format,
              card_width: normalizedWidth,
            }).join("")
          : noCodingActivityNode({
              color: textColor,
              text: stats.is_coding_activity_visible
                ? stats.is_other_usage_visible
                  ? i18n.t("wakatimecard.nocodingactivity")
                  : i18n.t("wakatimecard.nocodedetails")
                : i18n.t("wakatimecard.notpublic"),
            })
      }
    `;
  } else {
    finalLayout = flexLayout({
      items: filteredLanguages.length
        ? filteredLanguages.map((language, index) =>
            createTextNode({
              id: language.name,
              label: language.name,
              value: formatLanguageValue({ display_format, lang: language }),
              index,
              percent: language.percent,
              progressBarColor: titleColor,
              progressBarBackgroundColor: textColor,
              hideProgress: hide_progress,
              progressBarWidth: normalizedWidth - TOTAL_TEXT_WIDTH,
            }),
          )
        : [
            noCodingActivityNode({
              color: textColor,
              text: stats.is_coding_activity_visible
                ? stats.is_other_usage_visible
                  ? i18n.t("wakatimecard.nocodingactivity")
                  : i18n.t("wakatimecard.nocodedetails")
                : i18n.t("wakatimecard.notpublic"),
            }),
          ],
      gap: lheight,
      direction: "column",
    }).join("");
  }

  let titleText = i18n.t("wakatimecard.title");
  switch (stats.range) {
    case "last_7_days":
      titleText += ` (${i18n.t("wakatimecard.last7days")})`;
      break;
    case "last_year":
      titleText += ` (${i18n.t("wakatimecard.lastyear")})`;
      break;
  }

  const card = new Card({
    customTitle: custom_title,
    defaultTitle: titleText,
    width: normalizedWidth,
    height,
    border_radius,
    colors: { titleColor, textColor, iconColor, bgColor, borderColor },
    titlePrefixIcon: icons.wakatime,
  });

  if (disable_animations) card.disableAnimations();
  card.setHideBorder(hide_border);
  card.setHideTitle(hide_title);
  card.setCSS(`
    ${cssStyles}
    @keyframes slideInAnimation { from { width: 0; } to { width: calc(100%-100px); } }
    @keyframes growWidthAnimation { from { width: 0; } to { width: 100%; } }
    .lang-name { font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${textColor} }
    #rect-mask rect { animation: slideInAnimation 1s ease-in-out forwards; }
    .lang-progress { animation: growWidthAnimation 0.6s ease-in-out forwards; }
  `);

  return card.render(`<svg x="0" y="0" width="100%">${finalLayout}</svg>`);
};

export { renderWakatimeCard };
export default renderWakatimeCard;
