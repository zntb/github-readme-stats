import { FormGroup } from "./FormGroup";

interface StreakFormProps {
  title: string;
  onTitleChange: (value: string) => void;
}

export function StreakForm({ title, onTitleChange }: StreakFormProps) {
  return (
    <div className="space-y-5 animate-fade-in-up animate-delay-200">
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
