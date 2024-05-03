import './Edit.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import Markdown from 'react-markdown'
import { useAppSelector } from '../redux/hooks.ts'
import { useUpdateDocumentMutation, useFetchDocumentQuery } from "../redux/document/documentsApi.ts";
import { Document, Status } from "../redux/document/documentType.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "../../@/components/ui/command.tsx"

function Edit() {
  const navigate = useNavigate();
  const uid = useAppSelector(state => state.user.user?.uid);
  const {data: document} = useFetchDocumentQuery({ uid: uid ?? "", docId: useParams<{ id: string }>().id ?? "" });
  const [documentData, setDocumentData] = useState(document);
  const [updateDocument] = useUpdateDocumentMutation();

  useEffect(() => {
    if (document === undefined) return;
    setDocumentData(document);
  }, [document]);

  const updateDocumentState = <K extends keyof Document>(key: K, val: Document[K]) => {
    setDocumentData(prev => prev === undefined ? prev : ({ ...prev, [key]: val }))
  }
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => updateDocumentState("title", e.target.value);
  const onChangeContents = (e: React.ChangeEvent<HTMLTextAreaElement>) => updateDocumentState("contents", e.target.value);
  const onChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => updateDocumentState("status", e.target.value as Status);
  // const onChangeContributors = (e: React.ChangeEvent<HTMLInputElement>) => updateDocumentState("contributors", e.target.value.split(','));
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
  
  const inputRef = useRef<HTMLInputElement>(null); //focus周りの挙動を制御するために使用
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>()
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [inputText, setInputText] = useState('')
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input === null) return;
    if (e.key !== "Escape") return;
    input.blur();
  }, [])
  const inputStrings = ["apple", "banana", "cherry", "grape"];
  function findMatchingStrings(inputArray: string[], targetCharacter: string): string[] {
    const matchingStrings: string[] = [];
    for (const str of inputArray) {
        if (str.includes(targetCharacter)) {
            matchingStrings.push(str);
        }
    }
    return matchingStrings;
  }  
  useEffect(() => {
    setSearchResults(findMatchingStrings(inputStrings, inputText))
  }, [inputText]);

  return (
    <>
      <div>
        <div className="w-full flex">
          <input className="w-full" type="text" value={documentData?.title} onChange={onChangeTitle} ></input>
          <button className="border-solid" type="button" onClick={() => onClickSave()}>Save</button>
        </div>
        <div className="flex justify-between">
          <span>
            <select name="status" value={documentData?.status} onChange={onChangeStatus}>
              <option value="draft">draft</option>
              <option value="reviewed">reviewed</option>
              <option value="final">final</option>
              <option value="obsolete">obsolete</option>
            </select>
            {/* <input className="authors" type="text" value={documentData?.contributors} onChange={onChangeContributors}></input> */}
            <input className="reviewers" type="text" value={documentData?.reviewers} onChange={onChangeReviewers}></input>
          </span>
          <span>
            <span className="updated">
              Updated {documentData?.updated_at.toDate().toLocaleString()}
            </span>
          </span>
        </div>
        <div className="flex w-full h-svh">
          <textarea
            className="w-1/2 p-1"
            value={documentData?.contents}
            onChange={onChangeContents}
            placeholder="Enter Markdown here"
          />
          <div className="w-1/2  overflow-scroll overflow-visible overflow-x-hidden">
            <Markdown className='markdown'>{documentData?.contents}</Markdown>
          </div>
        </div>
      </div>

      <div>
        <Command shouldFilter={false} onKeyDown={handleKeyDown} value={selected}>
          <CommandInput value={inputText} ref={inputRef} placeholder='search' onValueChange={(text) => {
            setInputText(text)
            // 再編集時には選択済み項目をクリア
            if (selected) {
              setSelected(undefined)
            }
          }}
            onBlur={() => setOpen(false)}
            onFocus={() => {
              setOpen(true)
              if (selected) {
                inputRef.current?.select() // フォーカス時に選択済み項目がある場合、全選択する
              }
            }}
          />
          <div className="relative mt-2">
            {!selected && open && (
              <CommandList className="absolute left-0 top-0 w-full rounded bg-background shadow-md">
                <CommandEmpty className="text-muted-foreground px-4 py-2">ヒットなし</CommandEmpty>
                {searchResults?.map(v => (
                  <CommandItem
                    className="flex items-center gap-2"
                    onSelect={() => {
                      setSelected(v)
                      setInputText(v)
                    }}
                    value={v} key={v}>
                    {v}
                  </CommandItem>
                ))}
              </CommandList>
            )}
          </div>
        </Command>
      </div>
    </>
  )
}

export default Edit;
