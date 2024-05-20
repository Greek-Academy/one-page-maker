import './App.css';
import {useAppDispatch, useAppSelector} from './redux/hooks';
import {useEffect} from 'react';
import {auth} from './firebase.ts';
import {login, logout} from './redux/user/userSlice';
import {BrowserRouter, Link} from 'react-router-dom';
import {Router} from './Router';
import {FiFileText} from "react-icons/fi";
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
                        <nav className="relative px-4 py-4 flex justify-between items-center bg-white">
                            <Link className="text-3xl font-bold leading-none" to="/">
                                <FiFileText className='inline' />
                                <a className="p-1">One Pager Maker</a>
                            </Link>
                            <div className="lg:hidden">
                                <button className="navbar-burger flex items-center text-blue-600 p-3">
                                    <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <title>Mobile menu</title>
                                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                                    </svg>
                                </button>
                            </div>
                            <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:flex lg:items-center lg:w-auto lg:space-x-6">
                                <li><Link className="text-sm text-gray-400 hover:text-gray-500" to="/">Home</Link></li>
                                <li className="text-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </li>
                                <li><Link className="text-sm text-gray-400 hover:text-gray-500" to="/">about</Link></li>
                            </ul>
                            <a className="hidden lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200" onClick={() => {signOut(auth).catch(error =>console.error('Sign out failed:', error))}}>SignOut</a>
                        </nav>
                    </>
                ):(null)}
                <Router />
            </BrowserRouter>
        </div>
    );
}

export default App;
