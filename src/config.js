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
        resolution: 1,
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
                    { x: 200, y: 250 },
                    { x: 400, y: 300 }
                ],
                waves: [
                    {enemies: [{type: 'medusa', count: 1}]},
                ]
            }
        ]
    },
    enemies: {
        medusa: {
            health: 150,
            speed: 2,
            delay: 2
        },
    }
};

export default config;
