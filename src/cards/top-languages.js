// @ts-check
import { Card } from "../common/Card.js";
import { getCardColors } from "../common/color.js";
import { formatBytes } from "../common/fmt.js";
import { I18n } from "../common/I18n.js";
import { chunkArray, clampValue, lowercaseTrim } from "../common/ops.js";
import { createProgressNode, flexLayout, measureText } from "../common/render.js";
import { icons } from "../common/icons.js";
import { langCardLocales } from "../translations.js";

const DEFAULT_CARD_WIDTH = 300;
const MIN_CARD_WIDTH = 280;
const DEFAULT_LANG_COLOR = "#858585";
const CARD_PADDING = 25;
const COMPACT_LAYOUT_BASE_HEIGHT = 90;
const MAXIMUM_LANGS_COUNT = 20;
const NORMAL_LAYOUT_DEFAULT_LANGS_COUNT = 5;
const COMPACT_LAYOUT_DEFAULT_LANGS_COUNT = 6;
const DONUT_LAYOUT_DEFAULT_LANGS_COUNT = 5;
const PIE_LAYOUT_DEFAULT_LANGS_COUNT = 6;
const DONUT_VERTICAL_LAYOUT_DEFAULT_LANGS_COUNT = 6;

const getLongestLang = (arr) =>
  arr.reduce((saved, lang) => (lang.name.length > saved.name.length ? lang : saved), {
    name: "",
    size: 0,
    color: "",
  });

const degreesToRadians = (a) => a * (Math.PI / 180.0);
const radiansToDegrees = (a) => a / (Math.PI / 180.0);

const polarToCartesian = (cx, cy, r, deg) => {
  const rads = degreesToRadians(deg);
  return { x: cx + r * Math.cos(rads), y: cy + r * Math.sin(rads) };
};

const cartesianToPolar = (cx, cy, x, y) => {
  const radius = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
  let deg = radiansToDegrees(Math.atan2(y - cy, x - cx));
  if (deg < 0) deg += 360;
  return { radius, angleInDegrees: deg };
};

const getCircleLength = (r) => 2 * Math.PI * r;
const calculateCompactLayoutHeight = (n) => COMPACT_LAYOUT_BASE_HEIGHT + Math.round(n / 2) * 25;
const calculateNormalLayoutHeight = (n) => 45 + (n + 1) * 40;
const calculateDonutLayoutHeight = (n) => 215 + Math.max(n - 5, 0) * 32;
const calculateDonutVerticalLayoutHeight = (n) => 300 + Math.round(n / 2) * 25;
const calculatePieLayoutHeight = (n) => 300 + Math.round(n / 2) * 25;
const donutCenterTranslation = (n) => -45 + Math.max(n - 5, 0) * 16;

const trimTopLanguages = (topLangs, langs_count, hide) => {
  let langs = Object.values(topLangs);
  let langsToHide = {};
  let langsCount = clampValue(langs_count, 1, MAXIMUM_LANGS_COUNT);
  if (hide)
    hide.forEach((n) => {
      langsToHide[lowercaseTrim(n)] = true;
    });
  langs = langs
    .sort((a, b) => b.size - a.size)
    .filter((lang) => !langsToHide[lowercaseTrim(lang.name)])
    .slice(0, langsCount);
  const totalLanguageSize = langs.reduce((acc, curr) => acc + curr.size, 0);
  return { langs, totalLanguageSize };
};

const getDisplayValue = (size, percentages, format) =>
  format === "bytes" ? formatBytes(size) : `${percentages.toFixed(2)}%`;

const createProgressTextNode = ({ width, color, name, size, totalSize, statsFormat, index }) => {
  const staggerDelay = (index + 3) * 150;
  const paddingRight = 95;
  const progressTextX = width - paddingRight + 10;
  const progressWidth = width - paddingRight;
  const progress = (size / totalSize) * 100;
  const displayValue = getDisplayValue(size, progress, statsFormat);
  return `
    <g class="stagger" style="animation-delay: ${staggerDelay}ms">
      <text data-testid="lang-name" x="2" y="15" class="lang-name">${name}</text>
      <text x="${progressTextX}" y="34" class="lang-name">${displayValue}</text>
      ${createProgressNode({ x: 0, y: 25, color, width: progressWidth, progress, progressBarBackgroundColor: "#ddd", delay: staggerDelay + 300 })}
    </g>
  `;
};

const createCompactLangNode = ({
  lang,
  totalSize,
  hideProgress,
  statsFormat = "percentages",
  index,
}) => {
  const percentages = (lang.size / totalSize) * 100;
  const displayValue = getDisplayValue(lang.size, percentages, statsFormat);
  const staggerDelay = (index + 3) * 150;
  const color = lang.color || "#858585";
  return `
    <g class="stagger" style="animation-delay: ${staggerDelay}ms">
      <circle cx="5" cy="6" r="5" fill="${color}" />
      <text data-testid="lang-name" x="15" y="10" class='lang-name'>${lang.name} ${hideProgress ? "" : displayValue}</text>
    </g>
  `;
};

const createLanguageTextNode = ({ langs, totalSize, hideProgress, statsFormat }) => {
  const longestLang = getLongestLang(langs);
  const chunked = chunkArray(langs, langs.length / 2);
  const layouts = chunked.map((array) => {
    const items = array.map((lang, index) =>
      createCompactLangNode({ lang, totalSize, hideProgress, statsFormat, index }),
    );
    return flexLayout({ items, gap: 25, direction: "column" }).join("");
  });
  const percent = ((longestLang.size / totalSize) * 100).toFixed(2);
  const minGap = 150;
  const maxGap = 20 + measureText(`${longestLang.name} ${percent}%`, 11);
  return flexLayout({
    items: layouts,
    gap: maxGap < minGap ? minGap : maxGap,
    direction: "row",
  }).join("");
};

const createDonutLanguagesNode = ({ langs, totalSize, statsFormat }) =>
  flexLayout({
    items: langs.map((lang, index) =>
      createCompactLangNode({ lang, totalSize, hideProgress: false, statsFormat, index }),
    ),
    gap: 32,
    direction: "column",
  }).join("");

const renderNormalLayout = (langs, width, totalLanguageSize, statsFormat) =>
  flexLayout({
    items: langs.map((lang, index) =>
      createProgressTextNode({
        width,
        name: lang.name,
        color: lang.color || DEFAULT_LANG_COLOR,
        size: lang.size,
        totalSize: totalLanguageSize,
        statsFormat,
        index,
      }),
    ),
    gap: 40,
    direction: "column",
  }).join("");

const renderCompactLayout = (
  langs,
  width,
  totalLanguageSize,
  hideProgress,
  statsFormat = "percentages",
) => {
  const paddingRight = 50;
  const offsetWidth = width - paddingRight;
  let progressOffset = 0;
  const compactProgressBar = langs
    .map((lang) => {
      const percentage = parseFloat(((lang.size / totalLanguageSize) * offsetWidth).toFixed(2));
      const progress = percentage < 10 ? percentage + 10 : percentage;
      const output = `
      <rect mask="url(#rect-mask)" data-testid="lang-progress"
        x="${progressOffset}" y="0" width="${progress}" height="8" fill="${lang.color || "#858585"}" />
    `;
      progressOffset += percentage;
      return output;
    })
    .join("");

  return `
    ${
      hideProgress
        ? ""
        : `
      <mask id="rect-mask">
        <rect x="0" y="0" width="${offsetWidth}" height="8" fill="white" rx="5"/>
      </mask>
      ${compactProgressBar}
    `
    }
    <g transform="translate(0, ${hideProgress ? "0" : "25"})">
      ${createLanguageTextNode({ langs, totalSize: totalLanguageSize, hideProgress, statsFormat })}
    </g>
  `;
};

const renderDonutVerticalLayout = (langs, totalLanguageSize, statsFormat) => {
  const radius = 80;
  const totalCircleLength = getCircleLength(radius);
  let circles = [],
    indent = 0,
    startDelayCoefficient = 1;
  for (const lang of langs) {
    const percentage = (lang.size / totalLanguageSize) * 100;
    const circleLength = totalCircleLength * (percentage / 100);
    const delay = startDelayCoefficient * 100;
    circles.push(`
      <g class="stagger" style="animation-delay: ${delay}ms">
        <circle cx="150" cy="100" r="${radius}" fill="transparent" stroke="${lang.color}"
          stroke-width="25" stroke-dasharray="${totalCircleLength}" stroke-dashoffset="${indent}"
          size="${percentage}" data-testid="lang-donut" />
      </g>
    `);
    indent += circleLength;
    startDelayCoefficient++;
  }
  return `
    <svg data-testid="lang-items">
      <g transform="translate(0, 0)"><svg data-testid="donut">${circles.join("")}</svg></g>
      <g transform="translate(0, 220)">
        <svg data-testid="lang-names" x="${CARD_PADDING}">
          ${createLanguageTextNode({ langs, totalSize: totalLanguageSize, hideProgress: false, statsFormat })}
        </svg>
      </g>
    </svg>
  `;
};

const renderPieLayout = (langs, totalLanguageSize, statsFormat) => {
  const radius = 90,
    centerX = 150,
    centerY = 100;
  let startAngle = 0,
    startDelayCoefficient = 1;
  const paths = [];
  for (const lang of langs) {
    if (langs.length === 1) {
      paths.push(
        `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="none" fill="${lang.color}" data-testid="lang-pie" size="100" />`,
      );
      break;
    }
    const langSizePart = lang.size / totalLanguageSize;
    const percentage = langSizePart * 100;
    const angle = langSizePart * 360;
    const endAngle = startAngle + angle;
    const startPoint = polarToCartesian(centerX, centerY, radius, startAngle);
    const endPoint = polarToCartesian(centerX, centerY, radius, endAngle);
    const largeArcFlag = angle > 180 ? 1 : 0;
    const delay = startDelayCoefficient * 100;
    paths.push(`
      <g class="stagger" style="animation-delay: ${delay}ms">
        <path data-testid="lang-pie" size="${percentage}"
          d="M ${centerX} ${centerY} L ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y} Z"
          fill="${lang.color}" />
      </g>
    `);
    startAngle = endAngle;
    startDelayCoefficient++;
  }
  return `
    <svg data-testid="lang-items">
      <g transform="translate(0, 0)"><svg data-testid="pie">${paths.join("")}</svg></g>
      <g transform="translate(0, 220)">
        <svg data-testid="lang-names" x="${CARD_PADDING}">
          ${createLanguageTextNode({ langs, totalSize: totalLanguageSize, hideProgress: false, statsFormat })}
        </svg>
      </g>
    </svg>
  `;
};

const createDonutPaths = (cx, cy, radius, percentages) => {
  const paths = [];
  let startAngle = 0,
    endAngle = 0;
  const totalPercent = percentages.reduce((a, b) => a + b, 0);
  for (let i = 0; i < percentages.length; i++) {
    const percent = parseFloat(((percentages[i] / totalPercent) * 100).toFixed(2));
    endAngle = 3.6 * percent + startAngle;
    const startPoint = polarToCartesian(cx, cy, radius, endAngle - 90);
    const endPoint = polarToCartesian(cx, cy, radius, startAngle - 90);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    paths.push({
      percent,
      d: `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArc} 0 ${endPoint.x} ${endPoint.y}`,
    });
    startAngle = endAngle;
  }
  return paths;
};

const renderDonutLayout = (langs, width, totalLanguageSize, statsFormat) => {
  const centerX = width / 3,
    centerY = width / 3;
  const radius = centerX - 60,
    strokeWidth = 12;
  const colors = langs.map((lang) => lang.color);
  const langsPercents = langs.map((lang) =>
    parseFloat(((lang.size / totalLanguageSize) * 100).toFixed(2)),
  );
  const langPaths = createDonutPaths(centerX, centerY, radius, langsPercents);
  const donutPaths =
    langs.length === 1
      ? `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${colors[0]}" fill="none" stroke-width="${strokeWidth}" data-testid="lang-donut" size="100"/>`
      : langPaths
          .map((section, index) => {
            const delay = (index + 3) * 100 + 300;
            return `
          <g class="stagger" style="animation-delay: ${delay}ms">
            <path data-testid="lang-donut" size="${section.percent}" d="${section.d}" stroke="${colors[index]}" fill="none" stroke-width="${strokeWidth}"></path>
          </g>
        `;
          })
          .join("");
  const donut = `<svg width="${width}" height="${width}">${donutPaths}</svg>`;
  return `
    <g transform="translate(0, 0)">
      <g transform="translate(0, 0)">${createDonutLanguagesNode({ langs, totalSize: totalLanguageSize, statsFormat })}</g>
      <g transform="translate(125, ${donutCenterTranslation(langs.length)})">${donut}</g>
    </g>
  `;
};

const noLanguagesDataNode = ({ color, text, layout }) =>
  `<text x="${layout === "pie" || layout === "donut-vertical" ? CARD_PADDING : 0}" y="11" class="stat bold" fill="${color}">${text}</text>`;

const getDefaultLanguagesCountByLayout = ({ layout, hide_progress }) => {
  if (layout === "compact" || hide_progress === true) return COMPACT_LAYOUT_DEFAULT_LANGS_COUNT;
  if (layout === "donut") return DONUT_LAYOUT_DEFAULT_LANGS_COUNT;
  if (layout === "donut-vertical") return DONUT_VERTICAL_LAYOUT_DEFAULT_LANGS_COUNT;
  if (layout === "pie") return PIE_LAYOUT_DEFAULT_LANGS_COUNT;
  return NORMAL_LAYOUT_DEFAULT_LANGS_COUNT;
};

const renderTopLanguages = (topLangs, options = {}) => {
  const {
    hide_title = false,
    hide_border = false,
    card_width,
    title_color,
    text_color,
    bg_color,
    icon_color,
    hide,
    hide_progress,
    theme,
    layout,
    custom_title,
    locale,
    langs_count = getDefaultLanguagesCountByLayout({ layout, hide_progress }),
    border_radius,
    border_color,
    disable_animations,
    stats_format = "percentages",
    ring_color,
  } = options;

  const i18n = new I18n({ locale, translations: langCardLocales });
  const { langs, totalLanguageSize } = trimTopLanguages(topLangs, langs_count, hide);

  let width = card_width
    ? isNaN(card_width)
      ? DEFAULT_CARD_WIDTH
      : card_width < MIN_CARD_WIDTH
        ? MIN_CARD_WIDTH
        : card_width
    : DEFAULT_CARD_WIDTH;
  let height = calculateNormalLayoutHeight(langs.length);

  const colors = getCardColors({
    title_color,
    text_color,
    icon_color,
    bg_color,
    border_color,
    ring_color,
    theme,
  });

  let finalLayout = "";
  if (langs.length === 0) {
    height = COMPACT_LAYOUT_BASE_HEIGHT;
    finalLayout = noLanguagesDataNode({
      color: colors.textColor,
      text: i18n.t("langcard.nodata"),
      layout,
    });
  } else if (layout === "pie") {
    height = calculatePieLayoutHeight(langs.length);
    finalLayout = renderPieLayout(langs, totalLanguageSize, stats_format);
  } else if (layout === "donut-vertical") {
    height = calculateDonutVerticalLayoutHeight(langs.length);
    finalLayout = renderDonutVerticalLayout(langs, totalLanguageSize, stats_format);
  } else if (layout === "compact" || hide_progress == true) {
    height = calculateCompactLayoutHeight(langs.length) + (hide_progress ? -25 : 0);
    finalLayout = renderCompactLayout(langs, width, totalLanguageSize, hide_progress, stats_format);
  } else if (layout === "donut") {
    height = calculateDonutLayoutHeight(langs.length);
    width = width + 50;
    finalLayout = renderDonutLayout(langs, width, totalLanguageSize, stats_format);
  } else {
    finalLayout = renderNormalLayout(langs, width, totalLanguageSize, stats_format);
  }

  const card = new Card({
    customTitle: custom_title,
    defaultTitle: i18n.t("langcard.title"),
    width,
    height,
    border_radius,
    colors,
    titlePrefixIcon: icons.languages,
  });

  if (disable_animations) card.disableAnimations();
  card.setHideBorder(hide_border);
  card.setHideTitle(hide_title);
  card.setCSS(`
    @keyframes slideInAnimation { from { width: 0; } to { width: calc(100%-100px); } }
    @keyframes growWidthAnimation { from { width: 0; } to { width: 100%; } }
    .stat { font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; fill: ${colors.textColor}; }
    @supports(-moz-appearance: auto) { .stat { font-size:12px; } }
    .bold { font-weight: 700 }
    .lang-name { font: 400 11px "Segoe UI", Ubuntu, Sans-Serif; fill: ${colors.textColor}; }
    .stagger { opacity: 0; animation: fadeInAnimation 0.3s ease-in-out forwards; }
    #rect-mask rect { animation: slideInAnimation 1s ease-in-out forwards; }
    .lang-progress { animation: growWidthAnimation 0.6s ease-in-out forwards; }
  `);

  if (layout === "pie" || layout === "donut-vertical") return card.render(finalLayout);
  return card.render(`<svg data-testid="lang-items" x="${CARD_PADDING}">${finalLayout}</svg>`);
};

export {
  getLongestLang,
  degreesToRadians,
  radiansToDegrees,
  polarToCartesian,
  cartesianToPolar,
  getCircleLength,
  calculateCompactLayoutHeight,
  calculateNormalLayoutHeight,
  calculateDonutLayoutHeight,
  calculateDonutVerticalLayoutHeight,
  calculatePieLayoutHeight,
  donutCenterTranslation,
  trimTopLanguages,
  renderTopLanguages,
  MIN_CARD_WIDTH,
  getDefaultLanguagesCountByLayout,
};
