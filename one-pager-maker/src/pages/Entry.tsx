import Markdown from "react-markdown";
import { useParams } from "react-router-dom";
import { documentApi } from "../api/documentApi.ts";

function Entry() {
  const { uid, documentId } = useParams<{
    uid: string;
    documentId: string;
  }>();
  if (uid === undefined || documentId === undefined) {
    return <main>Route setting is wrong</main>;
  }
  const documentResult = documentApi.useGetDocumentQuery({ uid, documentId });
  const document = documentResult.data?.value;
  return (
    <>
      <div>
        <div className="flex h-svh w-full p-1">
          <div className="w-full overflow-visible overflow-scroll overflow-x-hidden border p-1">
            <Markdown className="markdown">{document?.contents}</Markdown>
          </div>
        </div>
      </div>
    </>
  );
}

export default Entry;
