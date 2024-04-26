import './Edit.css'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../redux/hooks.ts'
import Markdown from 'react-markdown'
import { useUpdateDocumentMutation, useFetchDocumentQuery } from "../redux/document/documentsApi.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Document, Status } from "../redux/document/documentType.ts";

function Edit() {
  const uid = useAppSelector(state => state.user.user?.uid)
  const [documentData, setDocumentData] = useState<Document | undefined>(undefined);
  const urlParams = useParams<{ id: string }>()
  const navigate = useNavigate();
  const { data } = useFetchDocumentQuery({ uid: uid ?? "", docId: urlParams.id ?? "" });
  const [updateDocument] = useUpdateDocumentMutation();

  useEffect(() => {
    if (data === undefined) return;
    setDocumentData(data);
  }, [data]);
  const updateDocumentState = <K extends keyof Document>(key: K, val: Document[K]) => {
    setDocumentData(prev => prev === undefined ? prev : ({ ...prev, [key]: val }))
  }
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => updateDocumentState("title", e.target.value);
  const onChangeContents = (e: React.ChangeEvent<HTMLTextAreaElement>) => updateDocumentState("contents", e.target.value);
  const onChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => updateDocumentState("status", e.target.value as Status);
  const onChangeContributors = (e: React.ChangeEvent<HTMLInputElement>) => updateDocumentState("contributors", e.target.value.split(','));
  const onChangeReviewers = (e: React.ChangeEvent<HTMLInputElement>) => updateDocumentState("reviewers", e.target.value.split(','));
  const onClickSave = async () => {
    if (uid == undefined) return;
    if (documentData == undefined) return;

    try {
      await updateDocument({ uid, documentData });
      navigate(`/`);
    } catch (e) {
      alert(`エラー: ${e?.toString()}`)
    }
  }
  return (
    <>
      <div>
        <div className="document-title-div">
          <input className="document-title" type="text" value={documentData?.title} onChange={onChangeTitle} ></input>
          <button type="button" onClick={() => onClickSave()}>Save</button>
        </div>
        <div className="document-parameter-div">
          <span>
            <select name="status" value={documentData?.status} onChange={onChangeStatus}>
              <option value="draft">draft</option>
              <option value="reviewed">reviewed</option>
              <option value="final">final</option>
              <option value="obsolete">obsolete</option>
            </select>
            <input className="authors" type="text" value={documentData?.contributors} onChange={onChangeContributors}></input>
            <input className="reviewers" type="text" value={documentData?.reviewers} onChange={onChangeReviewers}></input>
          </span>
          <span>
            <span className="updated">
              Updated {documentData?.updated_at.toDate().toLocaleString()}
            </span>
          </span>
        </div>
        <div className="document-contents-div">
          <textarea
            className="document-contents"
            value={documentData?.contents}
            onChange={onChangeContents}
            placeholder="Enter Markdown here"
          />
          <div className="document-markdown">
            <Markdown className='markdown'>{documentData?.contents}</Markdown>
          </div>
        </div>
      </div>
    </>
  )
}

export default Edit;
