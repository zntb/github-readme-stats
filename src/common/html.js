// @ts-check
const encodeHTML = (str) => {
  return str
    .replace(/[\u00A0-\u9999<>&](?!#)/gim, (i) => "&#" + i.charCodeAt(0) + ";")
    .replace(/\u0008/gim, "");
};
export { encodeHTML };
