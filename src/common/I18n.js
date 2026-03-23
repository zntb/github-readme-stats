// @ts-check
const FALLBACK_LOCALE = "en";

class I18n {
  constructor({ locale, translations }) {
    this.locale = locale || FALLBACK_LOCALE;
    this.translations = translations;
  }
  t(str) {
    if (!this.translations[str]) throw new Error(`${str} Translation string not found`);
    if (!this.translations[str][this.locale]) throw new Error(`'${str}' translation not found for locale '${this.locale}'`);
    return this.translations[str][this.locale];
  }
}

export { I18n };
export default I18n;
