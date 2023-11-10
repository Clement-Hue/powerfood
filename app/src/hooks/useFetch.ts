import React, {useEffect, useState} from "react";

export default function <T>(apiCall: () => Promise<T>): [T | undefined , React.Dispatch<React.SetStateAction<T | undefined>>]  {
    const [data, setData] = useState<T>();
    useEffect(() => {
        (async function() {
            const data = await apiCall();
            setData(data)
        })()
    }, []);

    return [data, setData];
}