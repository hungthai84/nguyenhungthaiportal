import React from 'react';

interface FormattedAiMessageProps {
  text: string;
}

function renderInlineBold(line: string, keyPrefix: string): React.ReactNode[] {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong
          key={`${keyPrefix}-b-${idx}`}
          className="font-semibold"
          style={{ color: 'var(--text-heading, var(--text-primary))' }}
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={`${keyPrefix}-t-${idx}`}>{part}</React.Fragment>;
  });
}

export const FormattedAiMessage: React.FC<FormattedAiMessageProps> = ({ text }) => {
  const blocks = text.split(/\n{2,}/).filter((b) => b.trim().length > 0);

  return (
    <div className="space-y-2.5 typo-body break-words [overflow-wrap:anywhere]">
      {blocks.map((block, bIdx) => {
        const lines = block
          .split('\n')
          .map((l) => l.trimEnd())
          .filter((l) => l.trim().length > 0);

        if (lines.length === 0) return null;

        const isBulletList = lines.every((l) => /^[-*•]\s+/.test(l.trim()));
        if (isBulletList) {
          return (
            <ul key={`blk-${bIdx}`} className="space-y-1.5 pl-4 list-disc">
              {lines.map((line, lIdx) => (
                <li key={`li-${bIdx}-${lIdx}`} className="leading-relaxed">
                  {renderInlineBold(line.trim().replace(/^[-*•]\s+/, ''), `${bIdx}-${lIdx}`)}
                </li>
              ))}
            </ul>
          );
        }

        const isOrderedList = lines.every((l) => /^\d+\.\s+/.test(l.trim()));
        if (isOrderedList) {
          return (
            <ol key={`blk-${bIdx}`} className="space-y-1.5 pl-5 list-decimal">
              {lines.map((line, lIdx) => (
                <li key={`ol-${bIdx}-${lIdx}`} className="leading-relaxed">
                  {renderInlineBold(line.trim().replace(/^\d+\.\s+/, ''), `${bIdx}-${lIdx}`)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <div key={`blk-${bIdx}`} className="space-y-1">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (/^#{1,3}\s+/.test(trimmed)) {
                return (
                  <h4
                    key={`h-${bIdx}-${lIdx}`}
                    className="typo-h5 font-play font-semibold pt-0.5"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {renderInlineBold(trimmed.replace(/^#{1,3}\s+/, ''), `${bIdx}-${lIdx}`)}
                  </h4>
                );
              }
              if (/^[-*•]\s+/.test(trimmed)) {
                return (
                  <p key={`bp-${bIdx}-${lIdx}`} className="pl-3 leading-relaxed">
                    • {renderInlineBold(trimmed.replace(/^[-*•]\s+/, ''), `${bIdx}-${lIdx}`)}
                  </p>
                );
              }
              return (
                <p key={`p-${bIdx}-${lIdx}`} className="leading-relaxed">
                  {renderInlineBold(trimmed, `${bIdx}-${lIdx}`)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default FormattedAiMessage;
