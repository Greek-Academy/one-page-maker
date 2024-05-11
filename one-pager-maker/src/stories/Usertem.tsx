import {useState} from "react";
import {Menu, MenuItem} from "./Menu.tsx";
import {useDetectClickOutside} from "react-detect-click-outside";

interface UserItemProps {
    userName: string;
    onClick: (user: string) => void;
}
export const UserItem: React.FC<UserItemProps> = ({userName, onClick}) => {
    const [openMenu, setOpenMenu] = useState(false);
    const ref = useDetectClickOutside({
        onTriggered: () => setOpenMenu(false)
    })
    return (
        <span ref={ref}>
            <button onClick={() => setOpenMenu(true)}>
                ...
            </button>
            <Menu open={openMenu}>
                <MenuItem>
                    <button onClick={() => onClick(userName)}>
                        {userName}
                    </button>
                </MenuItem>
            </Menu>
        </span>
    )
}
