import { FormGroup } from "./FormGroup";
import { STATS_OPTIONS } from "../types";

interface StatsFormProps {
  title: string;
  hide: string;
  show: string[];
  onTitleChange: (value: string) => void;
  onHideChange: (value: string) => void;
  onShowChange: (value: string[]) => void;
}

export function StatsForm({
  title,
  hide,
  show,
  onTitleChange,
  onHideChange,
  onShowChange,
}: StatsFormProps) {
  return (
    <div className="space-y-5 animate-fade-in-up animate-delay-200">
      <FormGroup label="Custom Title" description="Personalize your card title">
        <input
          type="text"
          placeholder="e.g., My GitHub Stats"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </FormGroup>
      <FormGroup label="Hide Stats" description="Comma-separated list to hide">
        <input
          type="text"
          placeholder="e.g., prs,issues,commits"
          value={hide}
          onChange={(e) => onHideChange(e.target.value)}
          className="font-mono text-sm"
        />
      </FormGroup>
      <FormGroup label="Additional Stats" description="Select extra metrics to display">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STATS_OPTIONS.map((s) => (
            <label
              key={s}
              className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary border border-card-border hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={show.includes(s)}
                onChange={(e) => {
                  if (e.target.checked) onShowChange([...show, s]);
                  else onShowChange(show.filter((x) => x !== s));
                }}
                className="w-4 h-4"
              />
              <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
                {s.replace(/_/g, " ")}
              </span>
            </label>
          ))}
        </div>
      </FormGroup>
    </div>
  );
}
