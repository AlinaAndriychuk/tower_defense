const manifest = {
    bundles: [
        {
            name: 'menu',
            assets: [
                {
                    alias: 'back',
                    src: './assets/back.png',
                },
            ],
        },
        {
            name: 'levels',
            assets: [
                {
                    alias: 'levels_back',
                    src: './assets/levels_back.png',
                },
                {
                    alias: 'level_0',
                    src: './assets/level_0.png',
                },
            ],
        },
    ]
};

export default manifest;