import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

const Stopwatch = ({ seconds, setElapsedTime,isRunning}) => {
    const intervalRef = useRef(null);
    const [time, setTime] = useState(0)

    const formatTime = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        setTime(`${h}:${m}:${s}`)
        return `${h}:${m}:${s}`;
    };

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                //setElapsedTime(Date.now() - startTimeRef.current);
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => {
            clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    useEffect(()=>{
        formatTime(seconds)
    },[])



    return (
        <>{time}</>
    )
}

export default Stopwatch