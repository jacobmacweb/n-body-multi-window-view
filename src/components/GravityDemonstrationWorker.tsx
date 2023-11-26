import React, {MutableRefObject, useEffect} from "react";
import {IEntity} from "../models/entity";

interface IGravityDemonstrationWorkerProps {
    $objects: MutableRefObject<IEntity[]>
}
export default function GravityDemonstrationWorker(props: IGravityDemonstrationWorkerProps) {
    console.log('Worker created');
    const $worker = React.useRef<SharedWorker>(new SharedWorker('./worker.js'));

    useEffect(() => {
        const worker = new SharedWorker('./worker.js');

        $worker.current = worker;
        // If worker sends us message asking for state
        worker.port.onmessage = function (ev) {
            if (ev.data.type === 'request-state') {
                console.log('Worker requested state')
                // Send state to worker
                worker.port.postMessage({
                    type: 'state',
                    state: props.$objects.current
                });
            } else if (ev.data.type === 'state') {
                console.log('Worker sent state')
                // I have received the state from the worker
                props.$objects.current = ev.data.state;
            }
        }

        worker.port.onmessageerror = function (e) {
            console.log('Worker message error', e);
        }

        worker.onerror = function (e) {
            console.log('Worker error', e);
        }

        console.log('Worker started');
        // Start worker
        worker.port.start();

        // send msg
        worker.port.postMessage({type: 'start'});

        console.log({worker})


        return () => {
            console.log('Worker terminated');
            worker.port.close();
            // remove handlers
            // $worker.current.port.onmessage = null;
        }
    }, []);

    return null;
}