export function calculateScreenCoordinates(
    x: number,
    y: number,
) {
    const [ screenX, screenY ] = [ window.screenX, window.screenY ];

    return {
        x: x + screenX,
        y: y + screenY,
    };
}

export function calculateWindowCoordinates(
    x: number,
    y: number,
    origin: 'topleft' | 'center' = 'topleft',
    scale: number = 1,
) {
    if (origin === 'center') {
        x += window.screen.width / 2;
        y += window.screen.height / 2;
    }

    x = x * scale;
    y = y * scale;

    const [ screenX, screenY ] = [ window.screenX, window.screenY ];

    return {
        x: x - screenX,
        y: y - screenY,
    };
}
