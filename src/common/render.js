// @ts-check
import { SECONDARY_ERROR_MESSAGES, TRY_AGAIN_LATER } from "./error.js";
import { getCardColors } from "./color.js";
import { encodeHTML } from "./html.js";
import { clampValue } from "./ops.js";

const flexLayout = ({ items, gap, direction, sizes = [] }) => {
  let lastSize = 0;
  return items.filter(Boolean).map((item, i) => {
    const size = sizes[i] || 0;
    let transform = `translate(${lastSize}, 0)`;
    if (direction === "column") transform = `translate(0, ${lastSize})`;
    lastSize += size + gap;
    return `<g transform="${transform}">${item}</g>`;
  });
};

/**
 * Extracts width and height from an SVG string
 * @param {string} svg - SVG string
 * @returns {{width: number, height: number}}
 */
const getSvgDimensions = (svg) => {
  const widthMatch = svg.match(/width="(\d+)"/);
  const heightMatch = svg.match(/height="(\d+)"/);
  return {
    width: widthMatch ? parseInt(widthMatch[1], 10) : 0,
    height: heightMatch ? parseInt(heightMatch[1], 10) : 0,
  };
};

/**
 * Creates a multi-column grid layout for displaying cards
 * @param {Object} options
 * @param {string[]} options.items - Array of SVG card strings to display
 * @param {number} options.columns - Number of columns
 * @param {number} options.rows - Number of rows (calculated from items if not provided)
 * @param {number} options.gap - Gap between cards (margin)
 * @param {number} options.totalWidth - Total width of the layout (optional, calculated if not provided)
 * @param {number} options.totalHeight - Total height of the layout (optional, calculated if not provided)
 * @returns {string} SVG string containing all cards in a multi-column layout
 */
const renderMultiColumnLayout = ({
  items,
  columns = 2,
  rows,
  gap = 25,
  totalWidth,
  totalHeight,
}) => {
  if (!items || items.length === 0) return "";

  // Get dimensions of each card
  const cardDimensions = items.map((item) => getSvgDimensions(item));

  // Calculate rows if not provided
  const numRows = rows || Math.ceil(items.length / columns);

  // Calculate max width and height for each column and row
  const columnWidths = Array(columns).fill(0);
  const rowHeights = Array(numRows).fill(0);

  items.forEach((item, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const dims = cardDimensions[index];

    if (dims.width > columnWidths[col]) {
      columnWidths[col] = dims.width;
    }
    if (dims.height > rowHeights[row]) {
      rowHeights[row] = dims.height;
    }
  });

  // Calculate total dimensions
  const calculatedWidth = columnWidths.reduce((sum, w) => sum + w, 0) + (columns - 1) * gap;
  const calculatedHeight = rowHeights.reduce((sum, h) => sum + h, 0) + (numRows - 1) * gap;

  const finalWidth = totalWidth || calculatedWidth;
  const finalHeight = totalHeight || calculatedHeight;

  // Create grid layout with proper positioning
  let gridItems = [];
  let currentY = 0;

  for (let row = 0; row < numRows; row++) {
    let currentX = 0;
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      if (index < items.length) {
        const cardWidth = columnWidths[col];
        const cardHeight = rowHeights[row];

        // Center the card within its cell
        const xOffset = (cardWidth - cardDimensions[index].width) / 2;
        const yOffset = (cardHeight - cardDimensions[index].height) / 2;

        gridItems.push(
          `<g transform="translate(${currentX + xOffset}, ${currentY + yOffset})">${items[index]}</g>`,
        );
      }
      currentX += columnWidths[col] + gap;
    }
    currentY += rowHeights[row] + gap;
  }

  return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="0 0 ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">${gridItems.join("\n")}</svg>`;
};

const createLanguageNode = (langName, langColor) => `
  <g data-testid="primary-lang">
    <circle data-testid="lang-color" cx="0" cy="-5" r="6" fill="${langColor}" />
    <text data-testid="lang-name" class="gray" x="15">${langName}</text>
  </g>
`;

const createProgressNode = ({
  x,
  y,
  width,
  color,
  progress,
  progressBarBackgroundColor,
  delay,
}) => {
  const progressPercentage = clampValue(progress, 2, 100);
  return `
    <svg width="${width}" x="${x}" y="${y}">
      <rect rx="5" ry="5" x="0" y="0" width="${width}" height="8" fill="${progressBarBackgroundColor}"></rect>
      <svg data-testid="lang-progress" width="${progressPercentage}%">
        <rect height="8" fill="${color}" rx="5" ry="5" x="0" y="0" class="lang-progress" style="animation-delay: ${delay}ms;" />
      </svg>
    </svg>
  `;
};

const iconWithLabel = (icon, label, testid, iconSize) => {
  if (typeof label === "number" && label <= 0) return "";
  const iconSvg = `
    <svg class="icon" y="-12" viewBox="0 0 16 16" version="1.1" width="${iconSize}" height="${iconSize}">
      ${icon}
    </svg>
  `;
  const text = `<text data-testid="${testid}" class="gray">${label}</text>`;
  return flexLayout({ items: [iconSvg, text], gap: 20, direction: "row" }).join("");
};

const ERROR_CARD_LENGTH = 576.5;

const UPSTREAM_API_ERRORS = [TRY_AGAIN_LATER, SECONDARY_ERROR_MESSAGES.MAX_RETRY];

const renderError = ({ message, secondaryMessage = "", renderOptions = {} }) => {
  /** @type {{ title_color?: any; text_color?: any; bg_color?: any; border_color?: any; theme?: string; show_repo_link?: boolean }} */
  const {
    title_color,
    text_color,
    bg_color,
    border_color,
    theme = "default",
    show_repo_link = true,
  } = renderOptions;
  const { titleColor, textColor, bgColor, borderColor } = getCardColors({
    title_color,
    text_color,
    icon_color: "",
    bg_color,
    border_color,
    ring_color: "",
    theme,
  });
  return `
    <svg width="${ERROR_CARD_LENGTH}" height="120" viewBox="0 0 ${ERROR_CARD_LENGTH} 120" fill="${bgColor}" xmlns="http://www.w3.org/2000/svg">
    <style>
    .text { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${titleColor} }
    .small { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${textColor} }
    .gray { fill: #858585 }
    </style>
    <rect x="0.5" y="0.5" width="${ERROR_CARD_LENGTH - 1}" height="99%" rx="4.5" fill="${bgColor}" stroke="${borderColor}"/>
    <text x="25" y="45" class="text">Something went wrong!${
      UPSTREAM_API_ERRORS.includes(secondaryMessage) || !show_repo_link
        ? ""
        : " file an issue at https://tiny.one/readme-stats"
    }</text>
    <text data-testid="message" x="25" y="55" class="text small">
      <tspan x="25" dy="18">${encodeHTML(message)}</tspan>
      <tspan x="25" dy="18" class="gray">${secondaryMessage}</tspan>
    </text>
    </svg>
  `;
};

const measureText = (str, fontSize = 10) => {
  const widths = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875, 0.8890625, 0.665625, 0.190625, 0.3328125,
    0.3328125, 0.3890625, 0.5828125, 0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875,
    0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875,
    0.5546875, 0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625, 0.665625,
    0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625, 0.721875, 0.2765625, 0.5, 0.665625,
    0.5546875, 0.8328125, 0.721875, 0.7765625, 0.665625, 0.7765625, 0.721875, 0.665625, 0.609375,
    0.721875, 0.665625, 0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875, 0.2765625,
    0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5, 0.5546875, 0.5546875, 0.2765625,
    0.5546875, 0.5546875, 0.221875, 0.240625, 0.5, 0.221875, 0.8328125, 0.5546875, 0.5546875,
    0.5546875, 0.5546875, 0.3328125, 0.5, 0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5,
    0.3546875, 0.259375, 0.353125, 0.5890625,
  ];
  const avg = 0.5279276315789471;
  return (
    str
      .split("")
      .map((c) => (c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg))
      .reduce((cur, acc) => acc + cur) * fontSize
  );
};

export {
  ERROR_CARD_LENGTH,
  renderError,
  createLanguageNode,
  createProgressNode,
  iconWithLabel,
  flexLayout,
  measureText,
  renderMultiColumnLayout,
};
