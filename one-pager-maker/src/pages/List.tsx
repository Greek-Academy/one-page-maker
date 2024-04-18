import './List.css'
import {useFetchDocumentsQuery} from "../redux/document/documentsApi.ts";

function List() {
    const result = useFetchDocumentsQuery({uid: 'testId'});

    return (
        <main className={"bg-gray-600 h-full"}>

        </main>
    )
}

export default List
