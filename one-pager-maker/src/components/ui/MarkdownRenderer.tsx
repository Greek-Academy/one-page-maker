import Markdown from "react-markdown";

interface MarkdownRendererProps {
  contents: string;
}

export const MarkdownRenderer = ({ contents }: MarkdownRendererProps) => {
  return <Markdown className="markdown">{contents}</Markdown>;
};
