import { CardType } from "../types";

interface InfoCardProps {
  cardType: CardType;
}

export function InfoCard({ cardType }: InfoCardProps) {
  return (
    <section className="glass-card animate-fade-in-up animate-delay-500">
      <h3 className="text-lg font-semibold mb-4 text-text">Quick Tips</h3>
      <ul className="space-y-3 text-sm text-text-secondary">
        <li className="flex items-start gap-2">
          <span className="text-primary mt-0.5">•</span>
          <span>
            Use a <strong className="text-text">GitHub Personal Access Token</strong> for higher
            rate limits
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-0.5">•</span>
          <span>Custom colors override theme selections</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-success mt-0.5">•</span>
          <span>Cards are cached by default for 24 hours</span>
        </li>
        {cardType === "multi" && (
          <li className="flex items-start gap-2">
            <span className="text-warning mt-0.5">•</span>
            <span>Multi-col uses HTML — GitHub Markdown renders it correctly in READMEs</span>
          </li>
        )}
      </ul>
    </section>
  );
}
