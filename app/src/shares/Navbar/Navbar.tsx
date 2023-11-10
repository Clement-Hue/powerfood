import React from 'react';
import classes from "./Navbar.module.scss"

const Navbar: React.FC<Props> = ({children}) => {
    return (
        <ul className={classes.container}>
            {children}
        </ul>
    );
};

type Props = {
    children?: React.ReactNode
}
export default Navbar;