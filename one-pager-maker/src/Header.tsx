import {signOut} from 'firebase/auth';
import {auth} from './firebase.ts';
import {Link} from 'react-router-dom';
import {useAppSelector} from './redux/hooks';
import {selectUser} from './redux/user/selector.ts';
import Icon from "./assets/OnePagerMaker.png"

function Header() {
    const user = useAppSelector(selectUser);
    const handleSignOut = () => signOut(auth).catch(error =>console.error('Sign out failed:', error));
    return (
        user ? (
        <header>
            <nav className="relative px-4 py-4 flex justify-between items-center bg-white">
                <Link className="text-3xl font-bold leading-none" to="/">
                    <img src={Icon} className="inline" />
                    <button className="p-1">One Pager Maker</button>
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
                    <li>|</li>
                    <li><Link className="text-sm text-gray-400 hover:text-gray-500" to="/">About</Link></li>
                </ul>
                <a className="hidden lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200" onClick={() => {handleSignOut()}}>SignOut</a>                
            </nav>
        </header>) : (null)
    );    
}

export default Header;
