import { useState } from 'react'
import Markdown from 'react-markdown'
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState('');
  const toMarkdownText = (e:any) => {
    setMarkdown(e.target.value);
  };
  return (
    <>
    <div>
      <h1>Markdown Editor</h1>
      <div className="editor-container">
        <textarea
          className="markdown-input"
          value={markdown}
          onChange={toMarkdownText}
          placeholder="Enter Markdown here"
        />
        <div className="markdown-preview">
          <Markdown>{markdown}</Markdown>
        </div>
      </div>
    </div>
   </>
  )
}

export default App
