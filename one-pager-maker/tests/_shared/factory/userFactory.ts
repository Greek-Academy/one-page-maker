import {Factory} from "fishery";
import {User} from "../../../src/entity/user/userType";
import {Timestamp} from "firebase/firestore";

export const userFactory = Factory.define<User>(({sequence}) => ({
    id: `id-${sequence}`,
    uid: `uid-${sequence}`,
    photoUrl: `https://example.com/${sequence}.png`,
    created_at: Timestamp.fromMillis(new Date().getTime() + sequence * 1000),
    updated_at: Timestamp.fromMillis(new Date().getTime() + sequence * 1000),
}));