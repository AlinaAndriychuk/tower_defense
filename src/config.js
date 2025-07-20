const config = {
    lang: 'en',
    entryState: 'menu',
    app: {
        antialias: false,
        backgroundAlpha: 0,
        backgroundColor: 0x000000,
        clearBeforeRender: true,
        forceCanvas: false,
        resizeTo: window,
        resolution: 1
    },
    state: {
        width: 960,
        height: 640,
        pivot: {
            x: 480,
            y: 320
        },
        safeWidth: 500,
        safeHeight: 500,
    },
    menu: {
        title: {
            y: 200
        },
        startButton: {
            width: 200,
            height: 70,
            color: 0xa0a0a0,
            y: 350
        }
    },
    levelSelector: {
        card: {
            width: 100,
            height: 100,
        },
        levels: [
            {
                id: 0,
                path: [
                    { x: 591, y: 80 },
                    { x: 591, y: 177 },
                    { x: 368, y: 177, sort: 'backToFront' },
                    { x: 368, y: 431 },
                    { x: 624, y: 431 },
                    { x: 624, y: 237, sort: 'backToFront' },
                    { x: 432, y: 237, sort: 'frontToBack' },
                    { x: 432, y: 367 },
                    { x: 561, y: 367 },
                    { x: 561, y: 334, sort: 'backToFront' },
                    { x: 720, y: 334 },
                ],
                waves: [
                    {enemies: [{type: 'medusa', count: 10}]},
                ]
            }
        ]
    },
    enemies: {
        medusa: {
            health: 150,
            speed: 200,
            delay: 2
        },
    }
};

export default config;
