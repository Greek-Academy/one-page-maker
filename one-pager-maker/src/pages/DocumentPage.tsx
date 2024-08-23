import { MarkdownRenderer } from "../components/ui/MarkdownRenderer";
import { useParams } from "react-router-dom";
import { documentApi } from "../api/documentApi.ts";

function DocumentPage() {
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
    <div>
      <div className="flex h-svh w-full p-1">
        <div className="w-full overflow-visible overflow-scroll overflow-x-hidden border p-1">
          <MarkdownRenderer
            contents={document?.contents || ""}
          ></MarkdownRenderer>
        </div>
      </div>
    </div>
  );
}

export default DocumentPage;
