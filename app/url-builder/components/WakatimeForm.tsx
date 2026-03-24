import { FormGroup } from "./FormGroup";

interface WakatimeFormProps {
  username: string;
  title: string;
  layout: string;
  onUsernameChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onLayoutChange: (value: string) => void;
}

export function WakatimeForm({
  username,
  title,
  layout,
  onUsernameChange,
  onTitleChange,
  onLayoutChange,
}: WakatimeFormProps) {
  return (
    <div className="space-y-5 animate-fade-in-up animate-delay-200">
      <FormGroup label="WakaTime Username *" description="Your public WakaTime username">
        <input
          type="text"
          placeholder="e.g., octocat"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="font-mono"
        />
      </FormGroup>
      <FormGroup label="Custom Title" description="Card title override">
        <input
          type="text"
          placeholder="e.g., WakaTime Stats"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </FormGroup>
      <FormGroup label="Layout" description="Visual arrangement">
        <select value={layout} onChange={(e) => onLayoutChange(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="compact">Compact</option>
        </select>
      </FormGroup>
    </div>
  );
}
