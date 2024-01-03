import MarkdownIt from "markdown-it";

function createMarkup(string: string) {
  return { __html: string };
}

export function MarkDownReader({ markdown = "" }: { markdown?: string }) {
  const md = MarkdownIt({
    html: true,
    typographer: true,
  });
  const result = md.render(markdown);
  return (
    <div>
      <div
        className="prose dark:prose-invert "
        dangerouslySetInnerHTML={createMarkup(result)}
      />
    </div>
  );
}
