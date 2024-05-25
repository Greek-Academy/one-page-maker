import './App.css';
import {useAppDispatch} from './redux/hooks';
import {useEffect} from 'react';
import {auth} from './firebase.ts';
import {login, logout} from './redux/user/userSlice';
import {BrowserRouter} from 'react-router-dom';
import {Router} from './Router';
import Header from './Header';

function App() {
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
                <Header/>
                <Router />
            </BrowserRouter>
        </div>
    );
}

export default App;
