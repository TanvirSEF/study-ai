import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  content: string;
}

export default function MathRenderer({ content }: MathRendererProps) {
  // Split the content by block math indicator $$
  const blockParts = content.split("$$");

  return (
    <div className="math-renderer space-y-4">
      {blockParts.map((blockPart, blockIdx) => {
        const isBlockMath = blockIdx % 2 === 1;

        if (isBlockMath) {
          try {
            const html = katex.renderToString(blockPart.trim(), {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <div
                key={blockIdx}
                className="my-4 overflow-x-auto py-2 flex justify-center text-white"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (err) {
            return (
              <pre key={blockIdx} className="bg-red-500/10 p-2 text-red-400 rounded-lg text-xs overflow-x-auto">
                {blockPart}
              </pre>
            );
          }
        }

        // Parse inline math $...$ within the non-block text
        const inlineParts = blockPart.split("$");
        return (
          <div key={blockIdx} className="leading-relaxed text-slate-300 whitespace-pre-wrap">
            {inlineParts.map((inlinePart, inlineIdx) => {
              const isInlineMath = inlineIdx % 2 === 1;

              if (isInlineMath) {
                try {
                  const html = katex.renderToString(inlinePart.trim(), {
                    displayMode: false,
                    throwOnError: false,
                  });
                  return (
                    <span
                      key={inlineIdx}
                      className="mx-1 text-white font-medium inline-block align-middle"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                } catch (err) {
                  return (
                    <code key={inlineIdx} className="bg-red-500/10 px-1 py-0.5 rounded text-red-400 text-xs">
                      {inlinePart}
                    </code>
                  );
                }
              }

              return <span key={inlineIdx}>{inlinePart}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}
