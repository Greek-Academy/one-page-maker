import './App.css';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { useEffect } from 'react';
import { auth } from './firebase.ts';
import { login, logout } from './redux/user/userSlice';
import { BrowserRouter, Link } from 'react-router-dom';
import { Router } from './Router';

import Login from './pages/Login.tsx';

function App() {
    const user = useAppSelector((state) => state.user.user);
    const dispatch = useAppDispatch();
    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log(authUser);
                dispatch(
                    login({
                        uid: authUser.uid,
                        email: authUser.email,
                        displayName: authUser.displayName,
                    })
                );
            } else {
                dispatch(logout());
            }
        });
    }, [dispatch]);

    return (
        <div className="App">
            {user ? (
                <>
                    <BrowserRouter>
                        <nav>
                            <ul id="nav">
                                <li>
                                    <Link to="/">一覧</Link>
                                </li>
                                <li>
                                    <Link to="/edit">編集</Link>
                                </li>
                                <li>
                                    <Link to="/login">ログイン</Link>
                                </li>
                            </ul>
                        </nav>
                        <Router />
                    </BrowserRouter>
                </>
            ) : (
                <Login />
            )}
        </div>
    );
}

export default App;
