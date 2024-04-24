import { configureStore } from '@reduxjs/toolkit';
import { documentsApi } from './document/documentsApi.ts';
import userReducer from './user/userSlice.ts';

export const store = configureStore({
    reducer: {
        [documentsApi.reducerPath]: documentsApi.reducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(documentsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
