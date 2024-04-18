import './App.css';
import Login from './components/Login/Login';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { useEffect } from 'react';
import { auth } from './firebase.ts';
import { login, logout } from './redux/user/userSlice';

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
            {user ? <div> {/* List Page */}</div> : <Login />}
        </div>
    );
}

export default App;
