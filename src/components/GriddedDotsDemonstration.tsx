import React, {useEffect} from "react";
import {calculateWindowCoordinates} from "../utils/coordinates";

export default function GriddedDotsDemonstration() {
    const $canvas = React.useRef<HTMLCanvasElement>(null);

    const draw = () => {
        if (!$canvas.current) return;

        $canvas.current.width = window.innerWidth;
        $canvas.current.height = window.innerHeight;
        const context = $canvas.current.getContext('2d');



        if (!context) return;

        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // circles are separated by 50 pixels
        const horizontalCircles = Math.floor(window.screen.width / 50);
        const verticalCircles = Math.floor(window.screen.height / 50);

        // draw circles
        for (let i = 0; i < horizontalCircles; i++) {
            for (let j = 0; j < verticalCircles; j++) {
                const {x, y}= calculateWindowCoordinates(i * 50, j * 50);
                context.beginPath();
                // alternate collours on odd/even patterns
                context.strokeStyle = (i + j) % 2 === 0 ? 'red' : 'blue';
                context.arc(x, y, 10, 0, 2 * Math.PI);
                context.stroke();
            }
        }
    }

    useEffect(() => {
        let run = true;

        const request = ()=> {
            if (run) {
                window.requestAnimationFrame(() => {
                    draw();
                    request();
                });
            }
        }

        request();

        return () => {
            run = false;
        }
    },[])

    useEffect(() => {

    }, []);


    return (
        // canvas 100% width and height
        <canvas ref={$canvas} width={window.innerWidth} height={window.innerHeight}/>
    )
}