import { signOut } from "firebase/auth";
import { auth } from "./firebase.ts";
import { Link } from "react-router-dom";
import { useAppSelector } from "./redux/hooks";
import { selectUser } from "./redux/user/selector.ts";
import { Button } from "@mui/material";
import { FaRegUserCircle } from "react-icons/fa";
import OnePagerMakerIcon from "./assets/OnePagerMaker.png";

const NavLinkItem = ({ title }: { title: string }) => {
  return (
    <Link className="text-sm text-gray-400 hover:text-gray-500" to="/">
      {title}
    </Link>
  );
};

function Header() {
  const user = useAppSelector(selectUser);
  const handleSignOut = () =>
    signOut(auth).catch((error) => console.error("Sign out failed:", error));
  return user ? (
    <header>
      <div className="relative flex items-center justify-between bg-white px-4 py-4">
        <div>
          <Link className="text-3xl font-bold leading-none" to="/">
            <img
              src={OnePagerMakerIcon}
              alt="onePagerMakerIcon"
              className="inline"
            />
            <Button type="button" className="p-1">
              One Pager Maker
            </Button>
          </Link>
        </div>
        <div>
          <nav>
            <ul className="absolute left-1/2 top-1/2 mx-auto flex w-auto -translate-x-1/2 -translate-y-1/2 transform items-center space-x-6">
              <li>
                <NavLinkItem title="Home" />
              </li>
              <li>|</li>
              <li>
                <NavLinkItem title="About" />
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <Link className="px-4 leading-none" to="/">
            <FaRegUserCircle className="mx-1 inline" />
            {user.displayName}
          </Link>
          <Button
            type="button"
            className="rounded-xl bg-blue-500 px-6 py-2 text-sm font-bold text-white transition duration-200 hover:bg-blue-600"
            onClick={() => {
              handleSignOut();
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  ) : null;
}

export default Header;
