import Markdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import { documentApi } from '../api/documentApi.ts';

function Entry() {
    const { uid, documentId } = useParams<{
        uid: string;
        documentId: string;
    }>();
    if (uid === undefined || documentId === undefined) {
        // this is called when route setting is wrong
        return <main>Route setting is wrong</main>;
    }
    const documentResult = documentApi.useGetDocumentQuery({ uid, documentId });
    const document = documentResult.data?.value;
    console.log('document', document);
    if (
        documentResult.data?.error &&
        documentResult.data?.error.code === 'permission-denied'
    ) {
        return (
            <main
                className={
                    'w-screen pt-48 flex flex-col justify-center gap-12 bg-background'
                }
            >
                <h1 className={'text-4xl text-center font-bold'}>
                    403 Forbidden
                </h1>
                <p className={'text-2xl text-center'}>
                    <span>Permission denied. </span>
                    <Link to={'/'} className={'text-link hover:underline'}>
                        Click here to return to the home page.
                    </Link>
                </p>
            </main>
        );
    }
    return (
        <>
            <div>
                <h1>Entry</h1>
                <div className="flex p-1 w-full h-svh">
                    <div className="border w-full p-1 overflow-scroll overflow-visible overflow-x-hidden">
                        <Markdown className="markdown">
                            {document?.contents}
                        </Markdown>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Entry;
