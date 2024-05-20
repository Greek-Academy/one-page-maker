import {useState} from "react";
import {Menu, MenuItem} from "./Menu.tsx";
import {useDetectClickOutside} from "react-detect-click-outside";
import {userApi} from "../api/userApi.ts";
import {useDebounce} from "../hook/useDebounce.ts";
import {FaPlus} from "react-icons/fa";
import {CiUser} from "react-icons/ci";

interface UserSelectMenuProps {
    onSelectUser: (uid: string) => void;
}

export const UserSelectMenu = ({onSelectUser}: UserSelectMenuProps) => {
    const [openMenu, setOpenMenu] = useState(false);
    const [query, setQuery] = useState('');
    const [searchParams] = useDebounce(query, 1000);
    const result = userApi.useSearchUsersQuery(searchParams);
    const ref = useDetectClickOutside({
        onTriggered: () => setOpenMenu(false)
    })
    return (
        <span ref={ref}>
            <button onClick={() => setOpenMenu(true)}>
                <FaPlus/>   
            </button>
            <span className="absolute w-full my-1">
                <Menu open={openMenu} className={'flex flex-col gap-1'}>
                    <input className="border m-1 p-1" type="text" placeholder="Type or choose a user" value={query} onChange={(e) => setQuery(e.target.value)}/>
                        {result.data?.map(user => (
                            <button key={user.id} onClick={() => {
                                onSelectUser(user.id);
                                setOpenMenu(false);
                                setQuery("");
                            }}>
                                <MenuItem>
                                    <CiUser className='inline mx-1' />
                                    {user.id}
                                </MenuItem>
                            </button>
                        ))}
                </Menu>
            </span>
        </span>
    )
}
