import { useState } from 'react'
import Markdown from 'react-markdown'
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState('');
  const toMarkdownText = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };
  return (
    <>
    <div>
      <div className="editor-title">
        <input className="title-text" type="text"></input>
      </div>
      <div className="editor-parameter">
      </div>
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
