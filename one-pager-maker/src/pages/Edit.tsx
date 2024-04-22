import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import './Edit.css'
import { useUpdateDocumentMutation, useFetchDocumentQuery } from "../redux/document/documentsApi.ts";
import { useParams } from "react-router-dom";
import { Document } from "../redux/document/documentType.ts";

function Edit() {
  const [markdown, setMarkdown] = useState('');
  const [document, setDocument] = useState<Document | undefined>(undefined);
  const toMarkdownText = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const urlParams = useParams<{ id: string }>()
  const [updateDocument] = useUpdateDocumentMutation();
  const {data, error, isError, isLoading} = useFetchDocumentQuery({uid: 'testUser', docId: urlParams.id})
  useEffect(() => {
    if (data !== undefined) {
      setDocument(data);
    }
  }, [data]);

  return (
    <>
    <div>
      <div className="document-title-div">
        <input className="document-title" type="text"></input>
        <button type="button" onClick={() => handleCreate()}>Save</button>
      </div>
      <div className="document-parameter-div">
        <span>
            <select name="status">
              <option value="draft">draft</option>
              <option value="reviewed">reviewed</option>
              <option value="final">final</option>
              <option value="obsolete">obsolete</option>
            </select>
            <span>
              <input className="authors" type="text"></input>
            </span>
            <span>
              <input className="reviewers" type="text"></input>
            </span>
        </span>
        <span>
            <span className="updated">
              Updated 2024/01/01
            </span>
        </span>
      </div>
      <div className="document-contents-div">
        <textarea
          className="document-contents"
          value={markdown}
          onChange={toMarkdownText}
          placeholder="Enter Markdown here"
        />
        <div className="document-markdown">
          <Markdown>{markdown}</Markdown>
        </div>
      </div>
    </div>
   </>
  )
}

export default Edit
