import { FormGroup } from "./FormGroup";

interface GistFormProps {
  gistId: string;
  showOwner: boolean;
  onGistIdChange: (value: string) => void;
  onShowOwnerChange: (value: boolean) => void;
}

export function GistForm({ gistId, showOwner, onGistIdChange, onShowOwnerChange }: GistFormProps) {
  return (
    <div className="space-y-5 animate-fade-in-up animate-delay-200">
      <FormGroup label="Gist ID *" description="The Gist identifier">
        <input
          type="text"
          placeholder="e.g., bbfce31e0217a3689c8d961a356cb10d"
          value={gistId}
          onChange={(e) => onGistIdChange(e.target.value)}
          className="font-mono text-sm"
        />
      </FormGroup>
      <label className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary border border-card-border hover:border-primary/50 transition-colors cursor-pointer">
        <input
          type="checkbox"
          checked={showOwner}
          onChange={(e) => onShowOwnerChange(e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-sm text-text-secondary">Show gist owner</span>
      </label>
    </div>
  );
}
