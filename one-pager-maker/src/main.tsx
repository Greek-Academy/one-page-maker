// DI コンテナ (tsyringe) に必要
import "reflect-metadata";

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Provider} from "react-redux";
import {store} from "./redux/store.ts";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./queryClient.ts";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <App/>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>,
)
