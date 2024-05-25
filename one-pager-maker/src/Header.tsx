import {signOut} from 'firebase/auth';
import {auth} from './firebase.ts';
import {Link} from 'react-router-dom';
import {useAppSelector} from './redux/hooks';
import {selectUser} from './redux/user/selector.ts';
import {Button} from '@mui/material';
import {FaRegUserCircle} from "react-icons/fa";
import OnePagerMakerIcon from "./assets/OnePagerMaker.png"

const NavLinkItem = ({ title }:{ title: string }) => {
    return (
        <Link className="text-sm text-gray-400 hover:text-gray-500" to="/">{title}</Link>        
    );
}

function Header() {
    const user = useAppSelector(selectUser);
    const handleSignOut = () => signOut(auth).catch(error =>console.error('Sign out failed:', error));
    return (
        user ? (
        <header>
            <div className="relative px-4 py-4 flex justify-between items-center bg-white">
                <div>
                    <Link className="text-3xl font-bold leading-none" to="/">
                        <img src={OnePagerMakerIcon} alt="onePagerMakerIcon" className="inline" />
                        <Button type="button" className="p-1">One Pager Maker</Button>
                    </Link>
                </div>
                <div>
                    <nav>
                        <ul className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 flex mx-auto items-center w-auto space-x-6">
                            <li><NavLinkItem title="Home"/></li>
                            <li>|</li>
                            <li><NavLinkItem title="About"/></li>
                        </ul>
                    </nav>
                </div>
                <div>
                    <Link className="leading-none px-4" to="/">
                        <FaRegUserCircle className='inline mx-1' />
                        {user.displayName}
                    </Link>
                    <Button type="button" className="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200" onClick={() => {handleSignOut()}}>Sign Out</Button>                
                </div>
            </div>
        </header>) : (null)
    );    
}

export default Header;
