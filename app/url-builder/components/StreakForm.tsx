import { FormGroup } from "./FormGroup";

interface StreakFormProps {
  username: string;
  title: string;
  onUsernameChange: (value: string) => void;
  onTitleChange: (value: string) => void;
}

export function StreakForm({ username, title, onUsernameChange, onTitleChange }: StreakFormProps) {
  return (
    <div className="space-y-5 animate-fade-in-up animate-delay-200">
      <FormGroup label="GitHub Username *" description="User whose streak to show">
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
          placeholder="e.g., Activity Streak"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </FormGroup>
    </div>
  );
}