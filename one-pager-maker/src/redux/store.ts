import {configureStore} from "@reduxjs/toolkit";
import {documentsApi} from "./document/documentsApi.ts";

export const store = configureStore({
    reducer: {
        [documentsApi.reducerPath]: documentsApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(documentsApi.middleware),
})
