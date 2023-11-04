import React, {useState} from 'react';
import {Button, Dialog, Input, Select} from "@shares";
import classes from "./Layout.module.scss"
import DRI from "src/DRI.json"

const Layout = () => {
    const [open, setOpen] = useState(false)
    return (
        <div>
            <Button onClick={() => setOpen(true)}>Ajouter aliment</Button>
            <Dialog open={open}>
                <div className={classes["dialog-container"]}>
                    <span className={classes["dialog__title"]}>Ajouter un aliment</span>
                    <div>
                        <Input label="name" />
                    </div>
                    <div className={classes["dialog__inputs-container"]}>
                        {DRI.map((nutrient) => (
                            <>
                                <Input min={0} type="number" label={nutrient.name}/>
                                <Select label="Unité" options={[
                                    {label: "mcg", value: "mcg"},
                                    {label: "mg", value: "mg"},
                                    {label: "g", value: "g"},
                                ]}/>
                            </>
                        ))}
                    </div>
                    <div className={classes["dialog__button-container"]}>
                        <Button onClick={() => setOpen(false)}>Fermer</Button>
                        <Button>Ajouter</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Layout;