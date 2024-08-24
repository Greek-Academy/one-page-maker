import "./Edit.css";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
import { Document, Status } from "../entity/documentType.ts";
import { Link, useParams } from "react-router-dom";
import { UserSelectMenu } from "../stories/UserItem.tsx";
import { RiPencilFill } from "react-icons/ri";
import { BiCommentEdit } from "react-icons/bi";
import { GoClock } from "react-icons/go";
import { documentApi } from "../api/documentApi.ts";
import { viewHistoryApi } from "@/api/viewHistoryApi.ts";
import { userApi } from "@/api/userApi.ts";
import { selectUser } from "@/redux/user/selector.ts";
import { useAppSelector } from "@/redux/hooks.ts";
import { MarkdownRenderer } from "../components/ui/MarkdownRenderer";

function Edit() {
  const { uid, documentId } = useParams<{ uid: string; documentId: string }>();

  const authUserUid = useAppSelector(selectUser)?.uid;
  const userQuery = userApi.useFindUserByUIDQuery(authUserUid ?? "");

  if (uid === undefined || documentId === undefined) {
    // this is called when route setting is wrong
    return <main>Route setting is wrong</main>;
  }

  const documentResult = documentApi.useGetDocumentQuery({ uid, documentId });
  const document = documentResult.data?.value;
  const [documentData, setDocumentData] = useState(document);
  const updateDocument = documentApi.useUpdateDocumentMutation();

  const editHistoryMutation = viewHistoryApi.useSetEditHistoryMutation();
  const reviewHistoryMutation = viewHistoryApi.useSetReviewHistoryMutation();

  useEffect(() => {
    if (document === undefined) return;
    setDocumentData(document);
  }, [document]);

  const updateDocumentState = <K extends keyof Document>(
    key: K,
    val: Document[K]
  ) => {
    setDocumentData((prev) =>
      prev === undefined ? prev : { ...prev, [key]: val }
    );
  };
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateDocumentState("title", e.target.value);
  const onChangeContents = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    updateDocumentState("contents", e.target.value);
  const onChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) =>
    updateDocumentState("status", e.target.value as Status);
  const onChangeContributors = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateDocumentState("contributors", e.target.value.split(","));
  const onChangeReviewers = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateDocumentState("reviewers", e.target.value.split(","));
  const handleAddingUser = (
    user: string,
    key: "contributors" | "reviewers"
  ) => {
    const preUser = documentData ? documentData[key] : [];
    const value = preUser[0] === "" ? [user] : [...preUser, user];
    if (key == "reviewers") {
      updateDocumentState("status", "reviewed");
    }
    updateDocumentState(key, value);
  };

  const onClickSave = async () => {
    if (uid == undefined) return;
    if (documentData == undefined) return;
    if (!userQuery.data) return;

    try {
      const result = await updateDocument.mutateAsync({
        uid,
        document: documentData
      });

      // 更新したときに閲覧履歴を設定
      const mutationArgs = {
        uid: userQuery.data.id,
        documentId: documentData.id,
        document: result
      };
      if (documentData.status === "reviewed") {
        reviewHistoryMutation.mutate(mutationArgs);
      } else {
        editHistoryMutation.mutate(mutationArgs);
      }
    } catch (e) {
      alert(`エラー: ${e?.toString()}`);
    }
  };

  if (
    documentResult.data?.error &&
    documentResult.data?.error.code === "permission-denied"
  ) {
    return (
      <main
        className={
          "flex w-screen flex-col justify-center gap-12 bg-background pt-48"
        }
      >
        <h1 className={"text-center text-4xl font-bold"}>403 Forbidden</h1>
        <p className={"text-center text-2xl"}>
          <span>Permission denied. </span>
          <Link to={"/"} className={"text-link hover:underline"}>
            Click here to return to the home page.
          </Link>
        </p>
      </main>
    );
  }

  return (
    <>
      <div>
        <div className="flex justify-between py-1">
          <input
            className="w-full border px-1 font-bold"
            type="text"
            value={documentData?.title}
            onChange={onChangeTitle}
          ></input>
          <button
            className="border-4 border-solid"
            type="button"
            onClick={() => onClickSave()}
          >
            Save
          </button>
          <button
            className="border-4 border-solid"
            type="button"
            onClick={() => onClickSave()}
          >
            Published
          </button>
        </div>
        <div className="flex justify-between">
          <span>
            <select
              className="mx-1 mr-5 border"
              name="status"
              value={documentData?.status}
              onChange={onChangeStatus}
            >
              <option value="draft">draft</option>
              <option value="reviewed">reviewed</option>
              <option value="final">final</option>
              <option value="obsolete">obsolete</option>
            </select>
            <RiPencilFill className="inline" />
            <input
              className="contributors mx-1 border px-1"
              type="text"
              value={documentData?.contributors}
              onChange={onChangeContributors}
            ></input>
            <UserSelectMenu
              onSelectUser={(e) => handleAddingUser(e, "contributors")}
            />
            <span className="mr-5" />
            <BiCommentEdit className="inline" />
            <input
              className="reviewers mx-1 border px-1"
              type="text"
              value={documentData?.reviewers}
              onChange={onChangeReviewers}
            ></input>
            <UserSelectMenu
              onSelectUser={(e) => handleAddingUser(e, "reviewers")}
            />
          </span>
          <span>
            <GoClock className="mx-1 inline" />
            <span className="updated px-1 italic">
              {documentData?.updated_at.toDate().toLocaleString()}
            </span>
          </span>
        </div>
        <div className="flex h-svh w-full p-1">
          <textarea
            className="w-1/2 border p-1"
            value={documentData?.contents}
            onChange={onChangeContents}
            placeholder="Enter Markdown here"
          />
          <div className="w-1/2 overflow-visible overflow-scroll overflow-x-hidden border p-1">
            <Markdown
              className="markdown"
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="whitespace-pre-wrap">{children}</p>
                ),
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !("inline" in props) && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="lang rounded-md text-sm"
                      {...(props as SyntaxHighlighterProps)}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      {...props}
                      className={`${className} rounded bg-gray-100 px-1 py-0.5 font-mono text-sm text-red-600`}
                    >
                      {children}
                    </code>
                  );
                }
              }}
            >
              {documentData?.contents || ""}
            </Markdown>
          </div>
        </div>
      </div>
    </>
  );
}

export default Edit;
