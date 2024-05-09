import {useState} from "react";
import {Menu, MenuItem} from "./Menu.tsx";
import {useDetectClickOutside} from "react-detect-click-outside";

export const UserItem = ({userName, onClick}: {
    userName: string,
    onClick: (user: string) => void,
}) => {
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

