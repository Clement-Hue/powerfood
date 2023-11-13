import {useEffect, useRef} from "react";

export default function (callback: () => void, timeout = 1000) {
    const timer = useRef<number | null>(null)
    useEffect(() => {
        timer.current = window.setTimeout(callback, timeout);
        return () => {
            if (timer.current) {
                clearTimeout(timer.current)
            }
        }
    }, [callback, timeout, timer]);
}