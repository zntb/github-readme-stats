import { FormGroup } from "./FormGroup";

interface PinFormProps {
  repo: string;
  title: string;
  showOwner: boolean;
  onRepoChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onShowOwnerChange: (value: boolean) => void;
}

export function PinForm({
  repo,
  title,
  showOwner,
  onRepoChange,
  onTitleChange,
  onShowOwnerChange,
}: PinFormProps) {
  return (
    <div className="space-y-5 animate-fade-in-up animate-delay-200">
      <FormGroup label="Repository *" description="Repository name">
        <input
          type="text"
          placeholder="e.g., hello-world"
          value={repo}
          onChange={(e) => onRepoChange(e.target.value)}
          className="font-mono"
        />
      </FormGroup>
      <FormGroup label="Custom Title" description="Override repository name">
        <input
          type="text"
          placeholder="e.g., My Awesome Project"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </FormGroup>
      <label className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary border border-card-border hover:border-primary/50 transition-colors cursor-pointer">
        <input
          type="checkbox"
          checked={showOwner}
          onChange={(e) => onShowOwnerChange(e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-sm text-text-secondary">Show repository owner</span>
      </label>
    </div>
  );
}
