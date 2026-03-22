/**
 * GitHub Readme Stats - TypeScript Definitions
 * Full TypeScript definitions for better IDE support
 */

// Re-export all card types
export * from "./cards/types.js";

// Re-export all fetcher types
export * from "./fetchers/types.js";

// ============================================
// Common Types
// ============================================

/**
 * Theme names available for cards (imported from themes)
 */
export type ThemeNames = string;

/**
 * Card color options
 */
export interface CardColors {
  titleColor?: string;
  textColor?: string;
  iconColor?: string;
  bgColor?: string | string[];
  borderColor?: string;
  ringColor?: string;
}

/**
 * Card constructor options
 */
export interface CardOptions {
  width?: number;
  height?: number;
  border_radius?: number;
  colors?: CardColors;
  customTitle?: string;
  defaultTitle?: string;
  titlePrefixIcon?: string;
}

/**
 * Card class
 */
export class Card {
  constructor(options?: CardOptions);
  disableAnimations(): void;
  setAccessibilityLabel(options: { title: string; desc: string }): void;
  setCSS(value: string): void;
  setHideBorder(value: boolean): void;
  setHideTitle(value: boolean): void;
  setTitle(text: string): void;
  renderTitle(): string;
  renderGradient(): string;
  getAnimations(): string;
  render(body: string): string;
}

/**
 * I18n translations type
 */
export interface TranslationData {
  [key: string]: string | TranslationData;
}

/**
 * I18n options
 */
export interface I18nOptions {
  locale?: string;
  translations: TranslationData;
}

/**
 * I18n class for internationalization
 */
export class I18n {
  constructor(options: I18nOptions);
  t(key: string): string;
}

/**
 * Flex layout options
 */
export interface FlexLayoutOptions {
  items: string[];
  gap: number;
  direction?: "row" | "column";
  sizes?: number[];
}

/**
 * Render error options
 */
export interface RenderErrorOptions {
  message: string;
  secondaryMessage?: string;
  renderOptions?: {
    title_color?: string;
    text_color?: string;
    bg_color?: string;
    border_color?: string;
    theme?: string;
    show_repo_link?: boolean;
  };
}

/**
 * Custom error class
 */
export class CustomError extends Error {
  constructor(message: string, type: string);
  type: string;
  secondaryMessage: string;
}

/**
 * Missing parameter error class
 */
export class MissingParamError extends Error {
  constructor(missedParams: string[], secondaryMessage?: string);
  missedParams: string[];
  secondaryMessage?: string;
}

/**
 * Retry options
 */
export interface RetryerOptions {
  fn: () => Promise<unknown>;
  validate?: (result: unknown) => boolean;
  maxRetries?: number;
  interval?: number;
}

/**
 * Cache TTL values
 */
export interface CacheTTL {
  STATS_CARD: { DEFAULT: number; MIN: number; MAX: number };
  TOP_LANGS_CARD: { DEFAULT: number; MIN: number; MAX: number };
  GIST_CARD: { DEFAULT: number; MIN: number; MAX: number };
  PIN_CARD: { DEFAULT: number; MIN: number; MAX: number };
  WAKATIME_CARD: { DEFAULT: number; MIN: number; MAX: number };
}

/**
 * Color calculation result
 */
export interface CardColorResult {
  titleColor: string;
  textColor: string;
  iconColor: string;
  bgColor: string | string[];
  borderColor: string;
  ringColor: string;
}

/**
 * Get card colors options
 */
export interface GetCardColorsOptions {
  title_color?: string;
  text_color?: string;
  icon_color?: string;
  bg_color?: string | string[];
  border_color?: string;
  ring_color?: string;
  theme?: string;
}

/**
 * Format bytes options
 */
export interface FormatBytesOptions {
  decimals?: number;
  units?: string[];
}

/**
 * Parse array options
 */
export interface ParseArrayOptions {
  separator?: string;
  stripQuotes?: boolean;
}

/**
 * Icons available
 */
export interface Icons {
  stargazers: string;
  fork: string;
  commits: string;
  prs: string;
  issues: string;
  contribs: string;
  prs_merged: string;
  prs_merged_percentage: string;
  reviews: string;
  discussions_started: string;
  discussions_answered: string;
  gist: string;
}

/**
 * Rank icon type
 */
export type RankIcon = "default" | "github" | "percentile";

/**
 * Top languages layout type
 */
export type TopLangLayout =
  | "compact"
  | "normal"
  | "donut"
  | "donut-vertical"
  | "pie";

/**
 * Wakatime layout type
 */
export type WakaTimeLayout = "compact" | "normal";

/**
 * Display format type
 */
export type DisplayFormat = "time" | "percent";

/**
 * Stats format type
 */
export type StatsFormat = "percentages" | "bytes";

/**
 * Number format type
 */
export type NumberFormat = "short" | "long";

// ============================================
// Common Utility Functions
// ============================================

/**
 * Checks if a string is a valid hex color
 */
export function isValidHexColor(hexColor: string): boolean;

/**
 * Check if the given string is a valid gradient
 */
export function isValidGradient(colors: string[]): boolean;

/**
 * Returns theme based colors with proper overrides and defaults
 */
export function getCardColors(options: GetCardColorsOptions): CardColorResult;

/**
 * Retrieves num with suffix k(thousands) precise to given decimal places
 */
export function kFormatter(num: number, precision?: number): string | number;

/**
 * Convert bytes to a human-readable string representation
 */
export function formatBytes(bytes: number): string;

/**
 * Split text over multiple lines based on the card width
 */
export function wrapTextMultiline(
  text: string,
  width?: number,
  maxLines?: number,
): string[];

/**
 * Returns boolean if value is either "true" or "false" else the value as it is
 */
export function parseBoolean(value: string | boolean): boolean | undefined;

/**
 * Parse string to array of strings
 */
export function parseArray(str: string): string[];

/**
 * Clamp the given number between the given range
 */
export function clampValue(number: number, min: number, max: number): number;

/**
 * Lowercase and trim string
 */
export function lowercaseTrim(name: string): string;

/**
 * Split array of languages in two columns
 */
export function chunkArray<T>(arr: T[], perChunk: number): T[][];

/**
 * Parse emoji from string
 */
export function parseEmojis(str: string): string;

/**
 * Get diff in minutes between two dates
 */
export function dateDiff(d1: Date, d2: Date): number;

/**
 * Flex layout utility
 */
export function flexLayout(options: FlexLayoutOptions): string[];

/**
 * Creates a node to display the primary programming language
 */
export function createLanguageNode(langName: string, langColor: string): string;

/**
 * Create a node to indicate progress in percentage along a horizontal line
 */
export function createProgressNode(options: {
  x: number;
  y: number;
  width: number;
  color: string;
  progress: number;
  progressBarBackgroundColor: string;
  delay: number;
}): string;

/**
 * Creates an icon with label
 */
export function iconWithLabel(
  icon: string,
  label: string | number,
  testid: string,
  iconSize: number,
): string;

/**
 * Error card length constant
 */
export const ERROR_CARD_LENGTH: number;

/**
 * Render error message on the card
 */
export function renderError(options: RenderErrorOptions): string;

/**
 * Retrieve text length
 */
export function measureText(str: string, fontSize?: number): number;

/**
 * Icons object
 */
export const icons: Icons;

/**
 * Get rank icon
 */
export function rankIcon(
  rankIcon: string,
  rankLevel: string,
  percentile: number,
): string;

/**
 * Retryer function
 */
export function retryer<T>(
  fetcher: (variables: unknown, token: string, retries?: number) => Promise<T>,
  variables: unknown,
  retries?: number,
): Promise<T>;

// ============================================
// Additional Types for Cards
// ============================================

/**
 * Repository data from fetchers
 */
export interface RepositoryData {
  name: string;
  nameWithOwner: string;
  isPrivate: boolean;
  isArchived: boolean;
  isTemplate: boolean;
  stargazers: { totalCount: number };
  description: string;
  primaryLanguage: {
    color: string;
    id: string;
    name: string;
  };
  forkCount: number;
  starCount: number;
}

/**
 * Gist data from fetchers
 */
export interface GistData {
  name: string;
  nameWithOwner: string;
  description: string | null;
  language: string | null;
  starsCount: number;
  forksCount: number;
}

/**
 * Stats data from fetchers
 */
export interface StatsData {
  name: string;
  totalPRs: number;
  totalPRsMerged: number;
  mergedPRsPercentage: number;
  totalReviews: number;
  totalCommits: number;
  totalIssues: number;
  totalStars: number;
  totalDiscussionsStarted: number;
  totalDiscussionsAnswered: number;
  contributedTo: number;
  rank: { level: string; percentile: number };
}

/**
 * Language data
 */
export interface Lang {
  name: string;
  color: string;
  size: number;
}

/**
 * Top languages data
 */
export type TopLangData = Record<string, Lang>;

/**
 * WakaTime data
 */
export interface WakaTimeData {
  categories: {
    digital: string;
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
  }[];
  daily_average: number;
  daily_average_including_other_language: number;
  days_including_holidays: number;
  days_minus_holidays: number;
  editors: {
    digital: string;
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
  }[];
  holidays: number;
  human_readable_daily_average: string;
  human_readable_daily_average_including_other_language: string;
  human_readable_total: string;
  human_readable_total_including_other_language: string;
  id: string;
  is_already_updating: boolean;
  is_coding_activity_visible: boolean;
  is_including_today: boolean;
  is_other_usage_visible: boolean;
  is_stuck: boolean;
  is_up_to_date: boolean;
  languages: {
    digital: string;
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
  }[];
  operating_systems: {
    digital: string;
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
  }[];
  percent_calculated: number;
  range: string;
  status: string;
  timeout: number;
  total_seconds: number;
  total_seconds_including_other_language: number;
  user_id: string;
  username: string;
  writes_only: boolean;
}

/**
 * WakaTime language
 */
export interface WakaTimeLang {
  name: string;
  text: string;
  percent: number;
}

/**
 * Streak data
 */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalContributingDays: number;
}

/**
 * Calculate rank options
 */
export interface CalculateRankOptions {
  totalStars?: number;
  totalCommits?: number;
  totalIssues?: number;
  totalPRs?: number;
  totalPRsMerged?: number;
  contributedTo?: number;
  numYears?: number;
}

/**
 * Rank result
 */
export interface RankResult {
  level: string;
  percentile: number;
}
