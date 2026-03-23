// @ts-check
import toEmoji from "emoji-name-map";

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
};

const parseArray = (str) => {
  if (!str) return [];
  return str.split(",");
};

const clampValue = (number, min, max) => {
  if (Number.isNaN(parseInt(number, 10))) return min;
  return Math.max(min, Math.min(number, max));
};

const lowercaseTrim = (name) => name.toLowerCase().trim();

const chunkArray = (arr, perChunk) => {
  return arr.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);
    if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
};

const parseEmojis = (str) => {
  if (!str) throw new Error("[parseEmoji]: str argument not provided");
  return str.replace(/:\w+:/gm, (emoji) => toEmoji.get(emoji) || "");
};

const dateDiff = (d1, d2) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const diff = date1.getTime() - date2.getTime();
  return Math.round(diff / (1000 * 60));
};

export { parseBoolean, parseArray, clampValue, lowercaseTrim, chunkArray, parseEmojis, dateDiff };
