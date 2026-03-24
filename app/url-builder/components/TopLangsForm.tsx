import { FormGroup } from "./FormGroup";

interface TopLangsFormProps {
  username: string;
  title: string;
  layout: string;
  langsCount: string;
  onUsernameChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onLayoutChange: (value: string) => void;
  onLangsCountChange: (value: string) => void;
}

export function TopLangsForm({
  username,
  title,
  layout,
  langsCount,
  onUsernameChange,
  onTitleChange,
  onLayoutChange,
  onLangsCountChange,
}: TopLangsFormProps) {
  return (
    <div className="space-y-5 animate-fade-in-up animate-delay-200">
      <FormGroup label="GitHub Username *" description="User whose languages to display">
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
          placeholder="e.g., Top Languages"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </FormGroup>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormGroup label="Layout" description="Visual arrangement">
          <select value={layout} onChange={(e) => onLayoutChange(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="compact">Compact</option>
            <option value="donut">Donut</option>
            <option value="donut-vertical">Donut Vertical</option>
            <option value="pie">Pie</option>
          </select>
        </FormGroup>
        <FormGroup label="Languages Count" description="Number to display (1-20)">
          <input
            type="number"
            min="1"
            max="20"
            value={langsCount}
            onChange={(e) => onLangsCountChange(e.target.value)}
            className="font-mono"
          />
        </FormGroup>
      </div>
    </div>
  );
}