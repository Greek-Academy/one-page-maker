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
        <span>
          <select name="pets" id="pet-select">
            <option value="">--Please choose an option--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
          </select>
        </span>
        <span>
          <input className="" type="text"></input>
        </span>
        <span>
          <input className="" type="text"></input>
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
