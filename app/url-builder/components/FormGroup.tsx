interface FormGroupProps {
  label: string;
  children: React.ReactNode;
  description?: string;
}

export function FormGroup({ label, children, description }: FormGroupProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-text flex items-center gap-2">{label}</label>
      {description && <p className="text-xs text-text-muted">{description}</p>}
      <div className="pt-1">{children}</div>
    </div>
  );
}
