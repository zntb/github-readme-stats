import { CardType } from "../types";

interface PreviewPanelProps {
  cardType: CardType;
  url: string;
  valid: boolean;
  multiUrls: string[];
  multiValid: boolean;
  multiHtmlSnippet: string;
  copied: boolean;
  markdownCopied: boolean;
  htmlCopied: boolean;
  onCopyUrl: () => void;
  onCopyMarkdown: () => void;
  onCopyHtml: () => void;
}

export function PreviewPanel({
  cardType,
  url,
  valid,
  multiUrls,
  multiValid,
  multiHtmlSnippet,
  copied,
  markdownCopied,
  htmlCopied,
  onCopyUrl,
  onCopyMarkdown,
  onCopyHtml,
}: PreviewPanelProps) {
  return (
    <section className="glass-card animate-fade-in-up animate-delay-400">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-success to-accent rounded-full" />
        Live Preview
        {cardType === "multi" && (
          <span className="text-xs font-normal text-text-muted ml-2">(side-by-side)</span>
        )}
      </h2>

      <div className="relative rounded-xl overflow-hidden mb-6 bg-bg-secondary border border-card-border shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
        <div className="relative flex items-center justify-center min-h-[200px] p-6">
          {/* Multi-col preview — render each SVG at its natural intrinsic size */}
          {cardType === "multi" ? (
            multiUrls.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  gap: "12px",
                  overflowX: "auto",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                {multiUrls.map((u, i) => (
                  <img
                    key={u + i}
                    src={u}
                    alt={`Card ${i + 1}`}
                    style={{
                      display: "block",
                      height: "auto",
                      width: "auto",
                      flexShrink: 0,
                      borderRadius: "8px",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="text-5xl mb-4 opacity-30">🗂️</div>
                <p className="text-text-muted text-sm">
                  Fill in usernames for each card to see the multi-column preview
                </p>
              </div>
            )
          ) : /* Single card preview */
          valid && url ? (
            <img
              key={url}
              src={url}
              alt="Card Preview"
              className="max-w-full h-auto rounded-lg shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).parentElement!.innerHTML =
                  '<div class="text-center p-8"><div class="text-4xl mb-3">⚠️</div><p class="text-text-muted text-sm">Error loading preview. Check your configuration.</p></div>';
              }}
            />
          ) : (
            <div className="text-center p-8">
              <div className="text-5xl mb-4 opacity-30">🎨</div>
              <p className="text-text-muted text-sm">Configure your card to see the preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Single card output */}
      {cardType !== "multi" && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-text">Generated URL</label>
          <div className="rounded-xl p-4 text-sm font-mono bg-bg-secondary border border-card-border shadow-inner overflow-x-auto leading-relaxed">
            <span className={valid ? "text-text" : "text-text-muted"}>
              {url || "Enter a username to generate URL"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onCopyUrl}
              disabled={!valid}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${valid ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]" : "bg-bg-tertiary text-text-muted cursor-not-allowed"}`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy URL
                </>
              )}
            </button>
            {valid && url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm text-center transition-all duration-300 bg-bg-tertiary border border-card-border text-text hover:border-primary/50 hover:bg-bg-secondary flex items-center justify-center gap-2 group"
              >
                <span>Open Card</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>

          {valid && url && (
            <div className="mt-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-text">Markdown Snippet</label>
                <button
                  onClick={onCopyMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-tertiary border border-card-border text-text-secondary hover:text-text hover:border-primary/50 transition-all"
                >
                  {markdownCopied ? (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-success"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-success">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="rounded-xl p-4 text-xs overflow-x-auto bg-bg-secondary border border-card-border shadow-inner">
                <code className="text-text-secondary font-mono">{`![GitHub Stats](${url})`}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Multi-col HTML output */}
      {cardType === "multi" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-text">HTML Snippet</label>
            <button
              onClick={onCopyHtml}
              disabled={!multiValid}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${multiValid ? "bg-bg-tertiary border-card-border text-text-secondary hover:text-text hover:border-primary/50" : "bg-bg-tertiary border-card-border text-text-muted cursor-not-allowed"}`}
            >
              {htmlCopied ? (
                <>
                  <svg
                    className="w-3.5 h-3.5 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-success">Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Copy HTML</span>
                </>
              )}
            </button>
          </div>
          <pre className="rounded-xl p-4 text-xs overflow-x-auto bg-bg-secondary border border-card-border shadow-inner min-h-[80px]">
            <code className="text-text-secondary font-mono whitespace-pre-wrap break-all">
              {multiValid ? multiHtmlSnippet : "Fill in card details above to generate HTML"}
            </code>
          </pre>
          {multiValid && (
            <p className="text-xs text-text-muted">
              Paste this HTML into your README.md. GitHub renders inline HTML for side-by-side
              layout.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
