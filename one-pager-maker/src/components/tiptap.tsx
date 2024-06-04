import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import HardBreak from '@tiptap/extension-hard-break'
import { JSONContent } from '@tiptap/core'

const getContent = (node: JSONContent): string => {
  if (node.type === 'text') return node.text ?? '';

  return node.content?.map(getContent).join('\n') ?? '';
}

interface MyEditorProps {
    content: string;
    onUpdate: (content: string, markdownText: string) => void;
}

export const Tiptap: React.FC<MyEditorProps> = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      HardBreak,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "p-1",
      },
    },
    onUpdate: ({ editor }) => {
      if (typeof onUpdate !== 'function') return;
      
      onUpdate(getContent(editor.getJSON()), editor.getText());
    }    
  })
  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
}
