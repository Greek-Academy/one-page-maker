import './Edit.css'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { useAppSelector } from '../redux/hooks.ts'
import { useUpdateDocumentMutation, useFetchDocumentQuery } from "../redux/document/documentsApi.ts";
import { Document, Status } from "../entity/documentType.ts";
import { useNavigate, useParams } from "react-router-dom";
import { UserSelectMenu } from "../stories/Usertem.tsx";
import { RiPencilFill } from "react-icons/ri";
import { BiCommentEdit } from "react-icons/bi";
import { GoClock } from "react-icons/go";

function Edit() {
  const navigate = useNavigate();
  const uid = useAppSelector(state => state.user.user?.uid);
  const displayName = useAppSelector(state => state.user.user?.displayName ?? "");
  const {data: document} = useFetchDocumentQuery({ uid: uid ?? "", docId: useParams<{ id: string }>().id ?? "" });
  const [documentData, setDocumentData] = useState(document);
  const [updateDocument] = useUpdateDocumentMutation();

  useEffect(() => {
    if (document === undefined) return;
    setDocumentData(document);
    if(documentData?.contributors === undefined) {
      updateDocumentState("contributors", [displayName]);
    }
    if (documentData?.contents === undefined) {
      // TODO:migrate to template
      const defaultContents  = `# Summary
- Item1
- Item2
- Item3

# Background

# Design/Proposal

# Open questions

# Reference

# Memo
      `;      
      updateDocumentState("contents", defaultContents);
    }

  }, [document]);

  const updateDocumentState = <K extends keyof Document>(key: K, val: Document[K]) => {
    setDocumentData(prev => prev === undefined ? prev : ({ ...prev, [key]: val }))
  }
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => updateDocumentState("title", e.target.value);
  const onChangeContents = (e: React.ChangeEvent<HTMLTextAreaElement>) => updateDocumentState("contents", e.target.value);
  const onChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => updateDocumentState("status", e.target.value as Status);
  const onChangeContributors = (e: React.ChangeEvent<HTMLInputElement>) => updateDocumentState("contributors", e.target.value.split(','));
  const onChangeReviewers = (e: React.ChangeEvent<HTMLInputElement>) => updateDocumentState("reviewers", e.target.value.split(','));
  const handleAddingUser = (user: string, key: 'contributors' | 'reviewers') =>
  {
    const preUser = documentData ? documentData[key] : [];
    const value = preUser[0] === "" ? [user] : [...preUser, user];
    if (key == 'reviewers') {
      updateDocumentState("status", 'reviewed');      
    }
    updateDocumentState(key, value); 
  }

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
        <div className="flex justify-between py-1">
          <input className="font-bold w-full border px-1" type="text" value={documentData?.title} onChange={onChangeTitle} ></input>
          <button className="border-solid border-4" type="button" onClick={() => onClickSave()}>Save</button>
        </div>
        <div className="flex justify-between">
          <span>
            <select className='border mx-1 mr-5' name="status" value={documentData?.status} onChange={onChangeStatus}>
              <option value="draft">draft</option>
              <option value="reviewed">reviewed</option>
              <option value="final">final</option>
              <option value="obsolete">obsolete</option>
            </select>
            <RiPencilFill className='inline' />
            <input className="contributors border mx-1 px-1" type="text" value={documentData?.contributors} onChange={onChangeContributors}></input>
            <UserSelectMenu userName={displayName} onSelectUser={e => handleAddingUser(e, "contributors")}/>
            <span className='mr-5' />
            <BiCommentEdit className='inline' />
            <input className="reviewers border mx-1 px-1" type="text" value={documentData?.reviewers} onChange={onChangeReviewers}></input>
            <UserSelectMenu userName={displayName} onSelectUser={e => handleAddingUser(e, "reviewers")}/>
         </span>
          <span>
            <GoClock className='inline mx-1' />
            <span className="updated px-1 italic">
              {documentData?.updated_at.toDate().toLocaleString()}
            </span>
          </span>
        </div>
        <div className="flex p-1 w-full h-svh">
          <textarea
            className="border w-1/2 p-1"
            value={documentData?.contents}
            onChange={onChangeContents}
            placeholder="Enter Markdown here"
          />
          <div className="border w-1/2 p-1 overflow-scroll overflow-visible overflow-x-hidden">
            <Markdown className='markdown'>{documentData?.contents}</Markdown>
          </div>
        </div>
      </div>
    </>
  )
}

export default Edit;
