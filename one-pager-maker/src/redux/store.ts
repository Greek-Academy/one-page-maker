import {configureStore} from "@reduxjs/toolkit";
import {documentsApi} from "./document/documentsApi.ts";
import userReducer from "./user/userSlice.ts";
import {
    useSelector as rawUseSelector,
    TypedUseSelectorHook,
  } from "react-redux";

export const store = configureStore({
    reducer: {
        [documentsApi.reducerPath]: documentsApi.reducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(documentsApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector