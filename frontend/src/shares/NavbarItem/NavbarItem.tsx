import React from 'react';
import classes from "./NavbarItem.module.scss"

const NavbarItem: React.FC<Props> = ({children, current, onClick}) => {
    return (
        <li aria-current={current && "page"} className={classes.container} onClick={onClick}>
            {children}
        </li>
    );
};

type Props = {
    children?: React.ReactNode
    onClick?: () => void
    current?: boolean
}
export default NavbarItem;