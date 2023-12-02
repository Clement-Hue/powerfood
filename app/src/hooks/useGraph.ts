import { useEffect, useRef } from "react";
import { Graph } from "@typing/internal.type";

export default function(graphFactory?: (el: HTMLElement) => Graph) {

    const graphContainerRef = useRef(null);

    useEffect(() => {
        if (!graphContainerRef.current){
            return;
        }
        const graph = graphFactory?.(graphContainerRef.current)
        graph?.create()
        return () => {
            graph?.remove()
        }
    }, [graphFactory])
    return graphContainerRef;
}

