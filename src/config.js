const config = {
    lang: 'en',
    entryState: 'menu',
    assets: [
        {alias: 'back', src: './assets/back.png'},
    ],
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
    }
};

export default config;
