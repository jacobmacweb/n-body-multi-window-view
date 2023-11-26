import {IEntity} from "../models/entity";

export function createSolarSystem(planetCount = 4) {
    const entities: IEntity[] = [];
    const sun: IEntity = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        mass: 100000,
        name: 'Sun',
    };

    entities.push(sun);

    // use maths to find the velocity of 4 planets orbiting the sun

    for (let i = 0; i < planetCount; i++) {
        const orbitRadius = Math.random() * 100_00000 + 100000;
        // const orbitRadius = 100000 + (i * 50000);

        const planetMass = 0.0001;

        // calculate necessary velocity
        const planetVelocity = Math.sqrt((sun.mass) / orbitRadius);


        // const angle = (i / planetCount) * Math.PI * 2;

        // random angle
        const angle = Math.random() * Math.PI * 2;

        const planet: IEntity = {
            x: sun.x + Math.cos(angle) * orbitRadius,
            y: sun.y - Math.sin(angle) * orbitRadius,
            vx: Math.sin(angle) * planetVelocity,
            vy: Math.cos(angle) * planetVelocity,
            mass: planetMass,
            name: `Planet ${i + 1}`,
        };

        entities.push(planet);
    }

    return entities;
}