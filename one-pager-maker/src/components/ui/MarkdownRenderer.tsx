import Markdown from "react-markdown";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface MarkdownRendererProps {
  contents: string;
}

export const MarkdownRenderer = ({ contents }: MarkdownRendererProps) => {
  return (
    <Markdown
      className="markdown"
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>,
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !("inline" in props) && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              className="lang rounded-md text-sm"
              {...(props as SyntaxHighlighterProps)}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              {...props}
              className={`${className} rounded bg-gray-100 px-1 py-0.5 font-mono text-sm text-red-600`}
            >
              {children}
            </code>
          );
        }
      }}
    >
      {contents || ""}
    </Markdown>
  );
};
