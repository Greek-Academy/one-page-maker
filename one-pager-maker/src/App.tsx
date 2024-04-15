import { BrowserRouter } from 'react-router-dom';
import { Router } from "./Router";
import './App.css'

function App() {
  return (
    <>
      <h1>Top</h1>
      <nav>
        <ul>
          <a href="/Edit">Edit</a>
          {/* <li><Link to="/">ホーム</Link></li>
          <li><Link to="/Edit">編集</Link></li>
          <li><Link to="/List">一覧</Link></li>
          <li><Link to="/Login">ログイン</Link></li> */}
        </ul>
      </nav>      
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </>
  )
}

export default App