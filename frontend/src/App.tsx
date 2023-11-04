import React, {useState} from 'react';
import {Navbar, NavbarItem} from "@shares";
import {Board, FoodSaved} from "./modules"

const App = () => {
    const [navigate, setNavigate] = useState("board")
    return (
        <>
            <Navbar>
                <NavbarItem current={navigate === "board"} onClick={() => setNavigate("board")}>Tableau</NavbarItem>
                <NavbarItem current={navigate === "foodSaved"} onClick={() => setNavigate("foodSaved")}>Aliments enregistrés</NavbarItem>
            </Navbar>
            {{
                board: <Board />,
                foodSaved: <FoodSaved />
            }[navigate]}
        </>
    );
};

export default App;