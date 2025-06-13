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
    levels: {
        card: {
            width: 100,
            height: 100,
        },
        levels: [
            {}
        ]
    }
};

export default config;
