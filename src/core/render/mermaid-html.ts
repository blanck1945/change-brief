/** Turn marked ```mermaid code blocks into <div class="mermaid"> for Mermaid.js */
export function mermaidHtmlFromMarked(html: string): string {
  return html.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (_, inner: string) => {
      const text = inner
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"');
      return `<div class="mermaid">${text}</div>`;
    },
  );
}

export const MERMAID_SCRIPT = `
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>mermaid.initialize({ startOnLoad: true, theme: "neutral" });</script>`;
