import React, {RefObject, useEffect} from "react";
import {calculateWindowCoordinates} from "../utils/coordinates";
import {IEntity} from "../models/entity";

interface IGravityDemonstrationProps {
    $objects: RefObject<IEntity[]>
}

const scale = 0.0001;
export default function GravityDemonstration(props: IGravityDemonstrationProps) {
    const $canvas = React.useRef<HTMLCanvasElement>(null);

    const draw = () => {
        if (!$canvas.current) return;

        $canvas.current.width = window.innerWidth;
        $canvas.current.height = window.innerHeight;
        const context = $canvas.current.getContext('2d');

        if (!context) return;

        context.fillStyle = '#232b2b';
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        props.$objects.current?.map(
            (object) => {
                const {x, y}= calculateWindowCoordinates(object.x * scale, object.y * scale, 'center');

                const colour = object.mass > 1000 ? 'red' : 'white';
                context.fillStyle = colour;
                context.beginPath();
                context.strokeStyle = colour;
                // proportional to object.mass, using log to make it more visible
                let radius = Math.log(object.mass) * 0.1;
                // ensure positive
                if (radius < 0) radius = -radius;
                context.arc(x, y, radius, 0, 2 * Math.PI);
                context.stroke();
                context.fill();
            }
        )
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


    return (
        // canvas 100% width and height
        <canvas ref={$canvas} width={window.innerWidth} height={window.innerHeight}/>
    )
}