import {useState} from "react";
import {Menu, MenuItem} from "./Menu.tsx";
import {useDetectClickOutside} from "react-detect-click-outside";
import { IoSettingsOutline } from "react-icons/io5";

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
                <IoSettingsOutline />
            </button>
            <Menu open={openMenu}>
                <MenuItem>
                    <button onClick={() => onSelectUser(userName)}>
                        {userName}
                    </button>
                </MenuItem>
            </Menu>
        </span>
    )
}
