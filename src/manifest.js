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
                    alias: 'level_selector_back',
                    src: './assets/level_select_back.png',
                },
                {
                    alias: 'level_selector_card_0',
                    src: './assets/level_select_card_0.png',
                },
            ],
        },
        {
            name: 'level_0',
            assets: [
                {
                    alias: 'level_0',
                    src: './assets/level_0.png',
                },
            ],
        },
    ]
};

export default manifest;