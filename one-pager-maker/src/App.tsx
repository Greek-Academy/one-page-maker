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
        <button type="button">Save</button>
      </div>
      <div className="editor-parameter">
        <span className='editor-parameter-left'>
            <select name="pets" id="pet-select">
              <option value="draft" selected>draft</option>
              <option value="reviewed">reviewed</option>
              <option value="final">final</option>
              <option value="obsolete">obsolete</option>
            </select>
            <span>
              <input className="" type="text"></input>
            </span>
            <span>
              <input className="" type="text"></input>
            </span>
        </span>
        <span className="editor-parameter-right">
            <span>
              Create Date 2024/01/01
            </span>
            <span>
              Update Date 2024/01/01
            </span>
        </span>
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
