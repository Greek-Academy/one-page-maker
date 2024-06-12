import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import HardBreak from '@tiptap/extension-hard-break'

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
      
      // TODO: The same procedure is required if you copy
      onUpdate(editor.getText({blockSeparator: '\n'}), editor.getText());
    }
  })
  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
}
