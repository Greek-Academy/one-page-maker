import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import HardBreak from '@tiptap/extension-hard-break'

interface MyEditorProps {
    content: string;
    onChange: (content: string) => void;
};
export const Tiptap: React.FC<MyEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      HardBreak,
    ],
    content: content.replace(/\n/g,"<br>"),
    editorProps: {
      attributes: {
        class: "p-1",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getText());
      }
    }    
  });

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
}
