import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC_DQXpUZNpgYhHzLhB_CUT3Vd4einr0tU",
    authDomain: "one-pager-maker.firebaseapp.com",
    projectId: "one-pager-maker",
    storageBucket: "one-pager-maker.appspot.com",
    messagingSenderId: "583942717761",
    appId: "1:583942717761:web:3ab98e673855670f6b21c0",
    measurementId: "G-9KG03HNXD2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
