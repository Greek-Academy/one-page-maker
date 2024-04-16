import { BrowserRouter, Link } from 'react-router-dom';
import { Router } from "./Router";
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <nav>
          <ul id="nav">
            <li><Link to="/">ホーム</Link></li>
            <li><Link to="/edit">編集</Link></li>
            <li><Link to="/list">一覧</Link></li>
            <li><Link to="/login">ログイン</Link></li>
          </ul>
        </nav>   
        <Router/>
      </BrowserRouter>
    </>
  )
}

export default App