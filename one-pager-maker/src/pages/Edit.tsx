import './Edit.css'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { useUpdateDocumentMutation, useFetchDocumentQuery } from "../redux/document/documentsApi.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Document, Status } from "../redux/document/documentType.ts";
import { auth } from '../firebase';

function Edit() {
  const uid = auth.currentUser?.uid ?? "";

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [status, setStatus] = useState<Status>('draft');
  const [contributors, setContributors] = useState('');
  const [reviewers, setReviewers] = useState('');
  const [document, setDocument] = useState<Document | undefined>(undefined);
  const urlParams = useParams<{ id: string }>()
  const navigate = useNavigate();
  const {data} = useFetchDocumentQuery({uid: uid, docId: urlParams.id ?? ""});
  const [updateDocument] = useUpdateDocumentMutation();
  
  useEffect(() => {
    console.log(data);
    if (data === undefined) return;
    setDocument(data);
    setTitle(data.title);
    setContents(data.contents);
    setStatus(data.status);
    setContributors(data.contributors.join(','));
    setReviewers(data.reviewers.join(','));
  }, [data]);

  const onChangeTitle = (e:React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onChangeContents = (e:React.ChangeEvent<HTMLTextAreaElement>) => setContents(e.target.value);
  const onChangeStatus = (e:React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as Status);
  const onChangeContributors =  (e:React.ChangeEvent<HTMLInputElement>) => setContributors(e.target.value);
  const onChangeReviewers =  (e:React.ChangeEvent<HTMLInputElement>) => setReviewers(e.target.value);
  const onClickSave = async () => {
    try {
      await updateDocument({
          uid: uid,
          documentData: {
              id:urlParams?.id ?? "",
              title: title,
              contents: contents,
              status: status,
              owner_id: uid,
              contributors: contributors.split(','),
              reviewers: reviewers.split(','),
              url_privilege: 'private',
          }
      });
      navigate(`/`);
    } catch (e) {
        alert(`エラー: ${e?.toString()}`)
    }
  }

  return (
    <>
    <div>
      <div className="document-title-div">
        <input className="document-title" type="text" value={title} onChange={onChangeTitle} ></input>
        <button type="button" onClick={() => onClickSave()}>Save</button>
      </div>
      <div className="document-parameter-div">
        <span>
            <select name="status" value={status} onChange={onChangeStatus}>
              <option value="draft">draft</option>
              <option value="reviewed">reviewed</option>
              <option value="final">final</option>
              <option value="obsolete">obsolete</option>
            </select>
            <input className="authors" type="text" value={contributors} onChange={onChangeContributors}></input>
            <input className="reviewers" type="text" value={reviewers} onChange={onChangeReviewers}></input>
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

export default Edit;
