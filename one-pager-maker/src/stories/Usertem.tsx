import {useState} from "react";
import {Menu, MenuItem} from "./Menu.tsx";
import {useDetectClickOutside} from "react-detect-click-outside";
import {FaPlus} from "react-icons/fa";
import {userApi} from "../api/userApi.ts";
import {useDebounce} from "../hook/useDebounce.ts";

interface UserSelectMenuProps {
    userName: string;
    onSelectUser: (uid: string) => void;
}

export const UserSelectMenu = ({userName, onSelectUser}: UserSelectMenuProps) => {
    const [openMenu, setOpenMenu] = useState(false);
    const ref = useDetectClickOutside({
        onTriggered: () => setOpenMenu(false)
    })
    const [query, setQuery] = useState('');
    const [searchParams] = useDebounce(query, 3000);
    const result = userApi.useSearchUsersQuery(searchParams);

    console.log(userName)
    return (
        <span ref={ref}>
            <button onClick={() => setOpenMenu(true)}>
                <FaPlus/>
            </button>
            <span className="absolute w-full my-1">
                <Menu open={openMenu} className={'flex flex-col gap-1'}>
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}/>
                    {result.data?.map(user => (
                        <MenuItem>
                            <button key={user.id} onClick={() => {
                                onSelectUser(user.uid);
                                setOpenMenu(false);
                            }}>
                                {user.id}
                            </button>
                        </MenuItem>
                    ))}
                </Menu>
            </span>
        </span>
    )
}
