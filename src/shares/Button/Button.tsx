import React from 'react';

const Button: React.FC<Props> = (props) => {
    return (
        <button {...props}/>
    );
};

type Props = React.HTMLAttributes<HTMLButtonElement>

export default Button;