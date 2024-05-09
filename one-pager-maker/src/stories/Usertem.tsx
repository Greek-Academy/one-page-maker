import {InitialUserState} from "../redux/user/userType.ts";
import {useState} from "react";
import {Menu, MenuItem} from "./Menu.tsx";
import {useDetectClickOutside} from "react-detect-click-outside";

export const UserItem = ({user, onClick}: {
    user: InitialUserState | null,
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
                    <button onClick={() => onClick(user?.user?.displayName ?? "")}>
                        {user?.user?.displayName ?? ""}
                    </button>
                </MenuItem>
            </Menu>
        </span>
    )
}

