import {Factory} from "fishery";
import {Document} from "../../../src/entity/documentType";
import {Timestamp} from "firebase/firestore";

export const documentFactory = Factory.define<Document>(({sequence}) => ({
    id: `document-${sequence}`,
    title: `title-${sequence}`,
    contents: `contents-${sequence}`,
    status: 'draft',
    owner_id: `uid-${sequence}`,
    contributors: [`uid-${sequence}`],
    reviewers: [`uid-${sequence}`],
    url_privilege: 'private',
    deleted_at: null,
    created_at: Timestamp.fromMillis(new Date().getTime() + sequence * 1000),
    updated_at: Timestamp.fromMillis(new Date().getTime() + sequence * 1000),
}));
