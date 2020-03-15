import { useEffect, useState } from "react";
import { notification } from "antd";
import { Emotion } from "./components/faceapi";

interface WindowSize {
    width: number | undefined;
    height: number | undefined;
}

// Hook for accessing window size
// adapted from https://usehooks.com/useWindowSize/
export function useWindowSize(onResize?: (newSize: WindowSize) => void) {
    const isClient = typeof window === 'object';

    function getSize() : WindowSize {
        return {
            width: isClient ? window.innerWidth : undefined,
            height: isClient ? window.innerHeight : undefined
        };
    }

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
        if (!isClient) {
            return () => null;
        }

        function handleResize() {
            setWindowSize(getSize());
            if(onResize) {
                onResize(getSize());
            }
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }); // Empty array ensures that effect is only run on mount and unmount

    return windowSize;
}


export const emotion2emoji = (emotion: Emotion | undefined) => {
    switch (emotion) {
        case "neutral":
            return "😐";
        case "happy":
            return "😄";
        case "sad":
            return "😞";
        case "surprised":
            return "😯";
        case "angry":
            return "😠";
        case "disgusted":
            return "🤮";
        case "fearful":
            return "😬";
        default:
            return "😐";
    }
}

type Placement = 'topRight' | 'topLeft'

export const feedbackNotification = (place?: Placement) => {
    notification.open({
        message: "NICE! 🙌",
        duration: 1.5,
        placement: place ? place : 'topRight',
        style: {
            backgroundColor: "lightgreen"
        }
    })
}

