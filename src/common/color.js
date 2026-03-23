// @ts-check
import { themes } from "../../themes/index.js";

const isValidHexColor = (hexColor) =>
  new RegExp(/^([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{4})$/).test(hexColor);

const isValidGradient = (colors) =>
  colors.length > 2 && colors.slice(1).every((color) => isValidHexColor(color));

const fallbackColor = (color, fallbackColor) => {
  let gradient = null;
  let colors = color ? color.split(",") : [];
  if (colors.length > 1 && isValidGradient(colors)) gradient = colors;
  return (gradient ? gradient : isValidHexColor(color) && `#${color}`) || fallbackColor;
};

const getCardColors = ({
  title_color,
  text_color,
  icon_color,
  bg_color,
  border_color,
  ring_color,
  theme,
}) => {
  const defaultTheme = themes["default"];
  const isThemeProvided = theme !== null && theme !== undefined;
  const selectedTheme = isThemeProvided ? themes[theme] : defaultTheme;
  const defaultBorderColor =
    "border_color" in selectedTheme ? selectedTheme.border_color : defaultTheme.border_color;

  const titleColor = fallbackColor(
    title_color || selectedTheme.title_color,
    "#" + defaultTheme.title_color,
  );
  const ringColor = fallbackColor(ring_color || selectedTheme.ring_color, titleColor);
  const iconColor = fallbackColor(
    icon_color || selectedTheme.icon_color,
    "#" + defaultTheme.icon_color,
  );
  const textColor = fallbackColor(
    text_color || selectedTheme.text_color,
    "#" + defaultTheme.text_color,
  );
  const bgColor = fallbackColor(bg_color || selectedTheme.bg_color, "#" + defaultTheme.bg_color);
  const borderColor = fallbackColor(border_color || defaultBorderColor, "#" + defaultBorderColor);

  if (
    typeof titleColor !== "string" ||
    typeof textColor !== "string" ||
    typeof ringColor !== "string" ||
    typeof iconColor !== "string" ||
    typeof borderColor !== "string"
  ) {
    throw new Error("Unexpected behavior, all colors except background should be string.");
  }
  return { titleColor, iconColor, textColor, bgColor, borderColor, ringColor };
};

export { isValidHexColor, isValidGradient, getCardColors };
