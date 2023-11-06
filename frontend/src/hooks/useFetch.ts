import {useEffect, useState} from "react";

export default function <T>(apiCall: () => Promise<T>) {
    const [data, setData] = useState<T>();
    useEffect(() => {
        (async function() {
            const data = await apiCall();
            setData(data)
        })()
    }, [apiCall]);

    return data;
}