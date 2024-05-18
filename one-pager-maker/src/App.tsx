import './App.css';
import {useAppDispatch, useAppSelector} from './redux/hooks';
import {useEffect} from 'react';
import {auth} from './firebase.ts';
import {login, logout} from './redux/user/userSlice';
import {BrowserRouter, Link} from 'react-router-dom';
import {Router} from './Router';
import {Button} from '@mui/material';
import {signOut} from 'firebase/auth';
import {selectUser} from './redux/user/selector.ts';

function App() {
    const user = useAppSelector(selectUser);
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
                        photoUrl: authUser.photoURL,
                    })
                );
            } else {
                dispatch(logout());
            }
        });
    }, [dispatch]);

    return (
        <div className="App">
            <BrowserRouter>
                {user ? (
                    <>
                        <nav>
                            <ul id="nav">
                                <li>
                                    <Link to="/">一覧</Link>
                                </li>
                                <li>
                                    <Link to="/edit">編集</Link>
                                </li>
                                <li>
                                    <Button onClick={() => { signOut(auth) }}>ログアウト</Button>
                                </li>
                            </ul>
                        </nav>
                    </>
                ):(null)}
                <Router />
            </BrowserRouter>
        </div>
    );
}

export default App;
