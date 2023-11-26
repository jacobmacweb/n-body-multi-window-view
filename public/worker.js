// Shared worker
const ports = [];

// This contains all the planets/entities. Stored to avoid overhead
let state = null;

const runPhysics = async () => {
    let start = Date.now();
    while (true) {
        const time = Date.now();
        let dt = time - start;
        const timeScale = 500;
        dt *= timeScale;

        let newState = [];

        for (let i = 0; i < state.length; i++) {
            const entity = state[i];
            const { x, y, vx, vy, mass } = entity;
            let fx = 0;
            let fy = 0;
            for (let j = 0; j < state.length; j++) {
                if (i === j) continue;
                const other = state[j];
                const dx = other.x - x;
                const dy = other.y - y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 50) continue;
                const f = (mass * other.mass) / (d * d);
                let theta = Math.atan2(other.y - y, other.x - x);
                // console.log({ theta, d, f })
                fx += Math.cos(theta) * f;
                fy += Math.sin(theta) * f;
            }

            const newVx = vx + (fx / mass) * dt;
            const newVy = vy + (fy / mass) * dt;


            const newX = x + newVx * dt;
            const newY = y + newVy * dt;


            newState.push({
                ...entity,
                x: newX,
                y: newY,
                vx: newVx,
                vy: newVy,
            });

        }

        state = newState;

        start = time;
        for (const port of ports) {
            port.postMessage({
                type: "state",
                state,
            });
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 / 60));

    }
}

onconnect = function (e) {
    console.log("connect", e)
    let port = e.ports[e.ports.length - 1];
    port.start();
    const idx = ports.length;
    ports.push(e.ports[e.ports.length - 1]);

    port.onmessage = async function (e) {
        console.log({e});
        if (e.data.type === "state") {
            state = e.data.state;
            runPhysics();
            console.log("recv state");
            for (const port of ports) {
                port.postMessage({
                    type: "state",
                    state,
                });
            }
        } else if (e.data.type === "start") {
            if (state) {
                console.log("sending state")
                port.postMessage({
                    type: "state",
                    state,
                });
            } else {
                while (!state) {
                    console.log("requesting state")
                    // request controller for state
                    port.postMessage({
                        type: "request-state",
                    });
                    console.log("requested state")
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                }
            }
        }
    };

    port.postMessage({
        type: "hello",
        idx,
    });
}





