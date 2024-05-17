import {useState} from "react";
import {Menu, MenuItem} from "./Menu.tsx";
import {useDetectClickOutside} from "react-detect-click-outside";
import { FaPlus } from "react-icons/fa";

interface UserSelectMenuProps {
    userName: string;
    onSelectUser: (uid: string) => void;    
}
export const UserSelectMenu = ({userName, onSelectUser}: UserSelectMenuProps) => {
    const [openMenu, setOpenMenu] = useState(false);
    const ref = useDetectClickOutside({
        onTriggered: () => setOpenMenu(false)
    })
    return (
        <span ref={ref}>
            <button onClick={() => setOpenMenu(true)}>
                <FaPlus />
            </button>
            <span className="absolute w-full my-1">
                <Menu open={openMenu}>
                    <MenuItem>
                        <button onClick={() => {
                            onSelectUser(userName);
                            setOpenMenu(false);
                        }}>
                            {userName}
                        </button>
                    </MenuItem>
                </Menu>
            </span>
        </span>
    )
}
