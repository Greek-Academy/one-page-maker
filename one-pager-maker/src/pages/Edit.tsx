import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import './Edit.css'
import { useUpdateDocumentMutation, useFetchDocumentQuery } from "../redux/document/documentsApi.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Document } from "../redux/document/documentType.ts";

function Edit() {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [document, setDocument] = useState<Document | undefined>(undefined);

  const urlParams = useParams<{ id: string }>()
  const navigate = useNavigate();
  const {data} = useFetchDocumentQuery({uid: 'testUser', docId: urlParams.id ?? ""});
  const [updateDocument] = useUpdateDocumentMutation();
  
  useEffect(() => {
    if (data !== undefined) {
      setDocument(data);
      setTitle(data.title);
      setContents(data.contents);
    }
  }, [data]);

  const onChangeTitle = (e:React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const onChangeContents = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setContents(e.target.value);
  };

  const handleCreate = async () => {
    try {
        const result = await updateDocument({
            uid: 'testUser',
            documentData: {
                id:urlParams?.id ?? "",
                title: title,
                contents: contents,
                status: 'draft',
                owner_id: 'testUser',
                contributors: [],
                reviewers: [],
                url_privilege: 'private',
            }
        });
        if ('data' in result){
            navigate(`/list`);
        }
    } catch (e) {
        alert(`エラー: ${e?.toString()}`)
    }
  }

  return (
    <>
    <div>
      <div className="document-title-div">
        <input className="document-title" type="text" value={title} onChange={onChangeTitle} ></input>
        <button type="button" onClick={() => handleCreate()}>Save</button>
      </div>
      <div className="document-parameter-div">
        <span>
            <select name="status" value={document?.status}>
              <option value="draft">draft</option>
              <option value="reviewed">reviewed</option>
              <option value="final">final</option>
              <option value="obsolete">obsolete</option>
            </select>
            <span>
              <input className="authors" type="text" value={document?.contributors.join(",")}></input>
            </span>
            <span>
              <input className="reviewers" type="text" value={document?.reviewers.join(",")}></input>
            </span>
        </span>
        <span>
            <span className="updated">
              Updated {document?.updated_at.toDate().toLocaleString()}
            </span>
        </span>
      </div>
      <div className="document-contents-div">
        <textarea
          className="document-contents"
          value={contents}
          onChange={onChangeContents}
          placeholder="Enter Markdown here"
        />
        <div className="document-markdown">
          <Markdown>{contents}</Markdown>
        </div>
      </div>
    </div>
   </>
  )
}

export default Edit
