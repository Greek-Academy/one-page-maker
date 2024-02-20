import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: import.meta.env.apiKey,
//   authDomain: import.meta.env.authDomain,
//   projectId: import.meta.env.projectId,
//   storageBucket: import.meta.env.storageBucket,
//   messagingSenderId: import.meta.env.messagingSenderId,
//   appId: import.meta.env.appId,
//   measurementId: import.meta.env.measurementId
// };
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
