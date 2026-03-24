export type SingleCardType = "stats" | "pin" | "top-langs" | "streak" | "gist" | "wakatime";
export type CardType = SingleCardType | "multi";

export const THEMES = [
  "default",
  "dark",
  "algolia",
  "apprentice",
  "aura",
  "aura_dark",
  "ayu-mirage",
  "blue-green",
  "blue_navy",
  "blueberry",
  "buefy",
  "calm",
  "calm_pink",
  "catppuccin_latte",
  "catppuccin_mocha",
  "city_lights",
  "cobalt",
  "cobalt2",
  "codeSTACKr",
  "date_night",
  "discord_old_blurple",
  "dracula",
  "flag-india",
  "github_dark",
  "github_dark_dimmed",
  "great-gatsby",
  "gruvbox",
  "gruvbox_light",
  "highcontrast",
  "holi",
  "kacho_ga",
  "maroongold",
  "merko",
  "midnight-purple",
  "moltack",
  "monokai",
  "neon",
  "nightowl",
  "noctis_minimus",
  "ocean_dark",
  "omni",
  "one_dark_pro",
  "onedark",
  "outrun",
  "panda",
  "prussian",
  "radical",
  "rose",
  "rose_pine",
  "slateorange",
  "swift",
  "synthwave",
  "tokyonight",
  "transparent",
  "yeblu",
];

export const GRADIENT_TEMPLATES = [
  { id: "sunset", name: "Sunset", angle: 135, colors: ["#ff6b6b", "#feca57", "#ff9ff3"] },
  { id: "ocean", name: "Ocean", angle: 45, colors: ["#2b5876", "#4e4376"] },
  { id: "midnight", name: "Midnight", angle: 90, colors: ["#0f2027", "#203a43", "#2c5364"] },
  { id: "aurora", name: "Aurora", angle: 45, colors: ["#00c9ff", "#92fe9d"] },
  { id: "candy", name: "Candy", angle: 45, colors: ["#d53369", "#daae51"] },
  { id: "deepsea", name: "Deep Sea", angle: 90, colors: ["#1a2988", "#26d0ce"] },
  { id: "purple-love", name: "Purple Love", angle: 45, colors: ["#cc2b5e", "#753a88"] },
  { id: "flamingo", name: "Flamingo", angle: 45, colors: ["#d53369", "#daae51"] },
];

export const GRADIENT_THEMES = ["ambient_gradient"];

export const CARD_TYPE_LABELS: Record<SingleCardType, string> = {
  stats: "Stats",
  pin: "Repo Pin",
  "top-langs": "Top Languages",
  streak: "Streak",
  gist: "Gist",
  wakatime: "WakaTime",
};

export interface ColorConfig {
  titleColor: string;
  iconColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

export interface MultiCard {
  id: string;
  type: SingleCardType;
  username: string;
  repo: string;
  gistId: string;
  height: number;
  layout: string;
  langsCount: string;
}

export interface CardTypeTab {
  id: CardType;
  label: string;
  icon: string;
}

export const CARD_TYPE_TABS: CardTypeTab[] = [
  { id: "stats", label: "Stats", icon: "📊" },
  { id: "pin", label: "Pin", icon: "📌" },
  { id: "top-langs", label: "Languages", icon: "🌐" },
  { id: "streak", label: "Streak", icon: "🔥" },
  { id: "gist", label: "Gist", icon: "📝" },
  { id: "wakatime", label: "Wakatime", icon: "⏱️" },
  { id: "multi", label: "Multi-Col", icon: "🗂️" },
];

export const DEFAULT_COLORS: ColorConfig = {
  titleColor: "#2f80ed",
  iconColor: "#4c71f2",
  textColor: "#434d58",
  bgColor: "#fffefe",
  borderColor: "#e4e2e2",
};

export const STATS_OPTIONS = [
  "prs_merged",
  "prs_merged_percentage",
  "reviews",
  "discussions_started",
  "discussions_answered",
  "contribs",
];