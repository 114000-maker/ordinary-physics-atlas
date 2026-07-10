"use client";

import { useMemo } from "react";
import katex from "katex";

export default function MathFormula({ latex }: { latex: string }) {
  const html = useMemo(
    () =>
      katex.renderToString(latex, {
        throwOnError: false,
        strict: "ignore",
        trust: false,
        output: "htmlAndMathml",
        displayMode: true,
      }),
    [latex],
  );

  return (
    <div className="math-formula">
      <div className="math-formula__render" dangerouslySetInnerHTML={{ __html: html }} />
      <details className="math-formula__source">
        <summary>LaTeX</summary>
        <code>{latex}</code>
      </details>
    </div>
  );
}
